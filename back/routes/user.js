const router = require('express').Router();
const bcrypt = require('bcrypt');
const { User } = require('../models');

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

module.exports = router;
