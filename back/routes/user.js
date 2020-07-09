const router = require('express').Router();
const bcrypt = require('bcrypt');
const passport = require('passport');
const { User } = require('../models');
/**
 * @description 로그인
 * @route POST /user/login
 */
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (info) return res.status(401).send(info.reason);
    return req.login(user, async (loginErr) => {
      // passport login
      // 내부적으로 알아서 쿠키를 보내줌
      // res.setHeader('Cookie', 'afadfadfdsf')
      // req.login 실행하면 serializeUser 실행
      if (loginErr) return next(loginErr);
      return res.status(200).json(user);
    });
  })(req, res, next);
});

/**
 * @description 회원가입
 * @route POST /user
 */
router.post('/', async (req, res, next) => {
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

router.post('/logout', (req, res) => {
  req.logOut();
  req.session.destroy();
  res.send('ok');
});

module.exports = router;
