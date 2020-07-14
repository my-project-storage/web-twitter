const { Op } = require('sequelize');
const { Post, Hashtag, Image, User, Comment } = require('../models');

const router = require('express').Router();

router.get('/:hashtag', async (req, res, next) => {
  try {
    const where = {};
    if (Number(req.query.lastId)) where.id = { [Op.lt]: Number(req.query.lastId) };
    const posts = await Post.findAll({
      where,
      limit: 10,
      order: [['createdAt', 'DESC']],
      include: [
        { model: Hashtag, where: { name: req.params.hashtag } },
        { model: User, attributes: ['id', 'nickname'] },
        { model: Image },
        { model: Comment, include: [{ model: User, attributes: ['id', 'nickname'], order: [['createdAt', 'DESC']] }] },
        { model: User, as: 'Likers', attributes: ['id'] },
        { model: Post, as: 'Retweet', include: [{ model: User, attributes: ['id', 'nickname'] }, { model: Image }] },
      ],
    });
    res.status(200).json(posts);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
