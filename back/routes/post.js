const router = require('express').Router();
const { Post, Comment, Image, User } = require('../models');
const { isLoggedIn } = require('./middleware');

/**
 * @description 게시글 작성
 * @route POST /post
 */
router.post('/', isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.create({
      content: req.body.content,
      UserId: req.user.id,
    });
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
