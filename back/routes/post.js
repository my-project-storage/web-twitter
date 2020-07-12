const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Post, Comment, Image, User, Hashtag } = require('../models');
const { isLoggedIn } = require('./middleware');

// ! directory exists
try {
  fs.accessSync('uploads');
} catch (err) {
  fs.mkdirSync('uploads');
}

// ! upload config
const upload = multer({
  storage: multer.diskStorage({
    // 어디다가 저장할건지
    destination(req, file, done) {
      done(null, 'uploads');
    },
    filename(req, file, done) {
      const ext = path.extname(file.originalname); // 확장자 추출
      const basename = path.basename(file.originalname, ext); // 파일이름
      done(null, basename + '_' + new Date().getTime() + ext);
    },
  }),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20mb, 크기 제한
});

/**
 * @description 게시글 불러오기
 * @route GET /:postId
 */
router.get('/:postId', async (req, res, next) => {
  try {
    const post = await Post.findOne({ where: { id: req.params.postId } });
    if (!post) return res.status(404).send('존재하지 않는 게시글입니다.');
    const fullPost = await Post.findOne({
      where: { id: post.id },
      include: [
        { model: Post, as: 'Retweet', include: [{ model: User, attributes: ['id', 'nickname'] }, { model: Image }] },
        { model: User, attributes: ['id', 'nickname'] },
        { model: User, as: 'Likers', attributes: ['id', 'nickname'] },
        { model: Image },
        { model: Comment, include: [{ model: User, attributes: ['id', 'nickname'] }] },
      ],
    });
    res.status(200).json(fullPost);
  } catch (err) {
    next(err);
  }
});

/**
 * @description 게시글 작성
 * @route POST /post
 */
router.post('/', isLoggedIn, upload.none(), async (req, res, next) => {
  try {
    const hashtags = req.body.content.match(/#[^\s#]+/g);
    const post = await Post.create({
      content: req.body.content,
      UserId: req.user.id,
    });
    if (hashtags) {
      const result = await Promise.all(hashtags.map((tag) => Hashtag.findOrCreate({ where: { name: tag.slice(1).toLowerCase() } })));
      // findOrCreate return -> [[value, boolean], ...]
      await post.addHashtags(result.map((v) => v[0]));
    }
    if (req.body.image) {
      if (Array.isArray(req.body.image)) {
        // 여러 개의 이미지라면 배열로 옴
        const images = await Promise.all(req.body.image.map((image) => Image.create({ src: image })));
        await post.addImages(images);
      } else {
        // 하나의 이미지는 배열이 아님
        const image = await Image.create({ src: req.body.image });
        await post.addImages(image);
      }
    }
    const fullPost = await Post.findOne({
      where: { id: post.id },
      include: [
        { model: Image },
        { model: Comment, include: [{ model: User, attributes: ['id', 'nickname'] }] },
        { model: User, attributes: ['id', 'nickname'] },
        { model: User, as: 'Likers', attributes: ['id'] }, // 좋아요 누른 유저
      ],
    });
    res.status(201).json(fullPost);
  } catch (err) {
    next(err);
  }
});

/**
 * @description 게시글에 이미지 업로드
 * @route POST /post/images
 */
router.post('/images', isLoggedIn, upload.array('image'), async (req, res, next) => {
  try {
    console.log(req.files);
    res.json(req.files.map((v) => v.filename));
  } catch (err) {
    next(err);
  }
});

/**
 * @description 게시글에 댓글 작성
 * @route POST /post/:postId/comment
 */
router.post('/:postId/comment', isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId },
    });
    if (!post) return res.status(403).send('존재하지 않는 게시글입니다.');
    const comment = await Comment.create({
      content: req.body.content,
      PostId: Number(req.params.postId),
      UserId: req.user.id,
    });
    const fullComment = await Comment.findOne({
      where: { id: comment.id },
      include: [{ model: User, attributes: ['id', 'nickname'] }],
    });
    res.status(201).json(fullComment);
  } catch (err) {
    next(err);
  }
});

/**
 * @description 리트윗
 * @route POST /post/:postId/retweet
 */
router.post('/:postId/retweet', isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId },
      include: [{ model: Post, as: 'Retweet' }],
    });
    if (!post) return res.status(403).send('존재하지 않는 게시글입니다.');
    if (req.user.id === post.UserId || (post.Retweet && post.Retweet.UserId === req.user.id)) {
      return res.status(403).send('자신의 글은 리트윗할 수 없습니다.');
    }
    const retweetTargetId = post.RetweetId || post.id;
    const exPost = await Post.findOne({
      where: { UserId: req.user.id, RetweetId: retweetTargetId },
    });
    if (exPost) return res.status(403).send('이미 리트윗했습니다.');
    const retweet = await Post.create({
      UserId: req.user.id,
      RetweetId: retweetTargetId,
      content: 'retweet',
    });
    const retweetWithPrevPost = await Post.findOne({
      where: { id: retweet.id },
      include: [
        {
          model: Post,
          as: 'Retweet',
          include: [{ model: User, attributes: ['id', 'nickname'] }, { model: Image }],
        },
        { model: User, attributes: ['id', 'nickname'] },
        { model: User, as: 'Likers', attributes: ['id'] },
        { model: Image },
        { model: Comment, include: [{ model: User, attributes: ['id', 'nickname'] }] },
      ],
    });
    res.status(200).json(retweetWithPrevPost);
  } catch (err) {
    next(err);
  }
});

/**
 * @description 게시글 삭제
 * @route DELETE /post/:postId
 */
router.delete('/:postId', isLoggedIn, async (req, res, next) => {
  try {
    await Post.destroy({
      where: {
        id: Number(req.params.postId),
        UserId: req.user.id,
      },
    });
    res.status(200).json({ PostId: Number(req.params.postId) });
  } catch (err) {
    next(err);
  }
});

/**
 * @description 좋아요
 * @route PATCH /post/:postId/like
 */
router.patch('/:postId/like', isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { id: Number(req.params.postId) },
    });
    if (!post) return res.status(403).send('게시글이 존재하지 않습니다.');
    await post.addLikers(req.user.id);
    res.status(200).json({ PostId: post.id, UserId: req.user.id });
  } catch (err) {
    next(err);
  }
});

/**
 * @description 좋아요 취소
 * @route DELETE /post/:postId/like
 */
router.delete('/:postId/like', isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { id: Number(req.params.postId) },
    });
    if (!post) return res.status(403).send('게시글이 존재하지 않습니다.');
    await post.removeLikers(req.user.id);
    res.status(200).json({ PostId: post.id, UserId: req.user.id });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
