const express = require('express');
const app = express();
const postRouter = require('./routes/post');
const db = require('./models');

db.sequelize
  .sync()
  .then(() => {
    console.log('db 연결 성공');
  })
  .catch((err) => {
    console.error('MYERROR:', err.message);
  });
app.use('/post', postRouter);

app.listen(9000, () => {
  console.log('서버 실행');
});
