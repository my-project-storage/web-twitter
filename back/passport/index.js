const passport = require('passport');
const local = require('./local');
const { User } = require('../models');

module.exports = () => {
  // 첫 로그인 시 실행
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  // 로그인 성공 후 그 다음 요청부터 실행
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findOne({ where: { id } });
      done(null, user); // req.user 로 넣어줌
    } catch (err) {
      done(err);
    }
  });
  local();
};
