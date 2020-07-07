const express = require('express');
const app = express();
const cors = require('cors');
const postRouter = require('./routes/post');
const userRouter = require('./routes/user');
const db = require('./models');

app.use(
  cors({
    origin: '*',
    credentials: false,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

db.sequelize
  .sync()
  .then(() => {
    console.log('db 연결 성공');
  })
  .catch((err) => {
    console.error('MYERROR:', err.message);
  });
app.use('/post', postRouter);
app.use('/user', userRouter);

app.listen(9000, () => {
  console.log('서버 실행');
});
