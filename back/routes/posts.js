const router = require('express').Router();
const { Post, User, Image, Comment } = require('../models');

router.get('/', async (req, res, next) => {
  try {
    const posts = await Post.findAll({
      limit: 10, // 10개만 가져옴
      order: [['createdAt', 'DESC']],
      include: [
        { model: User, attributes: ['id', 'nickname'] },
        { model: Image },
        { model: Comment, include: [{ model: User, attributes: ['id', 'nickname'], order: [['createdAt', 'DESC']] }] },
        { model: User, as: 'Likers', attributes: ['id'] },
      ],
      //   where: { id: lastId }, // 마지막으로 불러와진 id
    });
    res.status(200).json(posts);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
