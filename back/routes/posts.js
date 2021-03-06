const router = require('express').Router();
const { Post, User, Image, Comment } = require('../models');
const { Op } = require('sequelize');

router.get('/', async (req, res, next) => {
  try {
    const where = {};
    if (Number(req.query.lastId)) {
      // 초기 로딩이 아닐 때
      where.id = { [Op.lt]: Number(req.query.lastId) };
    }
    const posts = await Post.findAll({
      where,
      limit: 10, // 10개만 가져옴
      order: [['createdAt', 'DESC']],
      include: [
        { model: User, attributes: ['id', 'nickname'] },
        { model: Image },
        { model: Comment, include: [{ model: User, attributes: ['id', 'nickname'], order: [['createdAt', 'DESC']] }] },
        { model: User, as: 'Likers', attributes: ['id'] },
        {
          model: Post,
          as: 'Retweet',
          include: [{ model: User, attributes: ['id', 'nickname'] }, { model: Image }],
        },
      ],
      //   where: { id: lastId }, // 마지막으로 불러와진 id
    });
    res.status(200).json(posts);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
