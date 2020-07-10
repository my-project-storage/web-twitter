const express = require('express');
const app = express();
const cors = require('cors');
const postRouter = require('./routes/post');
const userRouter = require('./routes/user');
const postsRouter = require('./routes/posts');
const db = require('./models');
const session = require('express-session');
const passportConfig = require('./passport');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
require('dotenv').config();

app.use(
  cors({
    // credentials 가 true 이면 더 엄격하게 origin을 잡아줘야함
    // origin true 도 가능함
    origin: 'http://localhost:3000', // access controll allow origin
    credentials: true, // access controll allow credentials : true -> 쿠키전달
  })
);
passportConfig();
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    saveUninitialized: false,
    resave: false,
    secret: process.env.COOKIE_SECRET,
  })
);
app.use(passport.initialize());
app.use(passport.session());

db.sequelize
  .sync()
  .then(() => {
    console.log('db 연결 성공');
  })
  .catch((err) => {
    console.error('MYERROR:', err.message);
  });
app.use('/post', postRouter);
app.use('/posts', postsRouter);
app.use('/user', userRouter);

// app.use((err,req,res,next)=>{

// })

app.listen(9000, () => {
  console.log('서버 실행');
});
