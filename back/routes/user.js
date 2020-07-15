const router = require('express').Router();
const bcrypt = require('bcrypt');
const passport = require('passport');
const { Op } = require('sequelize');
const { User, Post, Image, Comment } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middleware');

/**
 * @description 사용자의 게시글 조회
 * @route GET /user/:id/posts?lastId
 */
router.get('/:id/posts', async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.params.id } });
    if (user) {
      const where = {};
      if (parseInt(req.query.lastId, 10)) {
        // 초기 로딩이 아닐 때
        where.id = { [Op.lt]: parseInt(req.query.lastId, 10) };
      } // 21 20 19 18 17 16 15 14 13 12 11 10 9 8 7 6 5 4 3 2 1
      const posts = await user.getPosts({
        where,
        limit: 10,
        include: [
          {
            model: Image,
          },
          {
            model: Comment,
            include: [
              {
                model: User,
                attributes: ['id', 'nickname'],
              },
            ],
          },
          {
            model: User,
            attributes: ['id', 'nickname'],
          },
          {
            model: User,
            through: 'Like',
            as: 'Likers',
            attributes: ['id'],
          },
          {
            model: Post,
            as: 'Retweet',
            include: [
              {
                model: User,
                attributes: ['id', 'nickname'],
              },
              {
                model: Image,
              },
            ],
          },
        ],
      });
      console.log(posts);
      res.status(200).json(posts);
    } else {
      res.status(404).send('존재하지 않는 사용자입니다.');
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

/**
 * @description 새로고침, 내 정보 불러오기
 * @route GET /user
 */
router.get('/', async (req, res, next) => {
  try {
    console.log(req.headers);
    if (req.user) {
      const fullUserWithoutPw = await User.findOne({
        attributes: { exclude: ['password'] },
        where: { id: req.user.id },
        include: [
          { model: Post, attributes: ['id'] },
          { model: User, as: 'Followings', attributes: ['id'] },
          { model: User, as: 'Followers', attributes: ['id'] },
        ],
      });
      res.status(200).json(fullUserWithoutPw);
    } else res.status(200).json(null);
  } catch (err) {
    next(err);
  }
});

/**
 * @description 로그인
 * @route POST /user/login
 */
router.post('/login', isNotLoggedIn, (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (info) return res.status(401).send(info.reason);
    return req.login(user, async (loginErr) => {
      // passport login
      // 내부적으로 알아서 쿠키를 보내줌
      // res.setHeader('Cookie', 'afadfadfdsf')
      // req.login 실행하면 serializeUser 실행
      if (loginErr) return next(loginErr);
      const fullUserWithoutPw = await User.findOne({
        attributes: { exclude: ['password'] },
        where: { id: user.id },
        include: [
          { model: Post, attributes: ['id'] },
          { model: User, as: 'Followings', attributes: ['id'] },
          { model: User, as: 'Followers', attributes: ['id'] },
        ],
      });
      return res.status(200).json(fullUserWithoutPw);
    });
  })(req, res, next);
});

/**
 * @description 회원가입
 * @route POST /user
 */
router.post('/', isNotLoggedIn, async (req, res, next) => {
  try {
    const { email, nick, password } = req.body;
    const exUser = await User.findOne({
      where: {
        email,
      },
    });
    if (exUser) return res.status(403).send('이미 사용중인 아이디');
    const hashPw = await bcrypt.hash(password, 10);
    await User.create({
      email,
      nickname: nick,
      password: hashPw,
    });
    res.status(201).send('ok');
  } catch (err) {
    next(err); // statusCode 500
  }
});

/**
 * @description 닉네임 수정
 * @route PATCH /user/nickname
 */
router.patch('/nickname', isLoggedIn, async (req, res, next) => {
  try {
    await User.update({ nickname: req.body.nickname }, { where: { id: req.user.id } });
    res.status(200).json({ nickname: req.body.nickname });
  } catch (err) {
    next(err);
  }
});

/**
 * @description 팔로우
 * @route PATCH /user/:userId/follow
 */
router.patch('/:userId/follow', isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.params.userId } });
    if (!user) return res.status(403).send('없는 사람입니다.');
    await user.addFollowers(req.user.id);
    res.status(200).json({ UserId: Number(req.params.userId) }); // action.data
  } catch (err) {
    next(err);
  }
});

/**
 * @description 언팔로우
 * @route PATCH /user/:userId/follow
 */
router.delete('/:userId/follow', isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.params.userId } });
    if (!user) return res.status(403).send('없는 사람입니다.');
    await user.removeFollowers(req.user.id);
    res.status(200).json({ UserId: Number(req.params.userId) });
  } catch (err) {
    next(err);
  }
});

/**
 * @description 팔로워 제거
 * @route PATCH /user/follower/:userId
 */
router.delete('/follower/:userId', isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.params.userId } });
    if (!user) return res.status(403).send('없는 사람입니다.');
    await user.removeFollowings(req.user.id);
    res.status(200).json({ UserId: Number(req.params.userId) });
  } catch (err) {
    next(err);
  }
});

/**
 * @description 팔로워 불러오기
 * @route GET /user/followers
 */
router.get('/followers', isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    if (!user) return res.status(403).send('없는 사람입니다.');

    let followers = await user.getFollowers({
      limit: Number(req.query.limit),
    });
    const result = followers.map((follower) => {
      delete follower.dataValues.password;
      return follower;
    });
    res.status(200).json(result); // action.data
  } catch (err) {
    next(err);
  }
});

/**
 * @description 팔로잉(내가 팔로잉한 사람) 불러오기
 * @route GET /user/followings
 */
router.get('/followings', isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    if (!user) return res.status(403).send('없는 사람입니다.');

    const followings = await user.getFollowings({
      limit: Number(req.query.limit),
    });
    res.status(200).json(followings); // action.data
  } catch (err) {
    next(err);
  }
});

/**
 * @description 로그아웃
 * @route POST /user/logout
 */
router.post('/logout', isLoggedIn, (req, res) => {
  req.logOut();
  req.session.destroy();
  res.send('ok');
});

/**
 * @description 사용자 정보 불러오기
 * @route GET /user/:userId
 */
router.get('/:userId', async (req, res, next) => {
  try {
    const fullUserWithoutPw = await User.findOne({
      attributes: { exclude: ['password'] },
      where: { id: req.params.userId },
      include: [
        { model: Post, attributes: ['id'] },
        { model: User, as: 'Followings', attributes: ['id'] },
        { model: User, as: 'Followers', attributes: ['id'] },
      ],
    });
    if (fullUserWithoutPw) {
      const data = fullUserWithoutPw.toJSON();
      // 개인정보 침해 예방
      data.Posts = data.Posts.length;
      data.Followers = data.Followers.length;
      data.Followings = data.Followings.length;
      res.status(200).json(data);
    } else res.status(404).json('존재하지 않는 사용자입니다.');
  } catch (err) {
    next(err);
  }
});

module.exports = router;
