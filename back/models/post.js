module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    'Post',
    {
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      charset: 'utf8mb4', // 이모티콘까지
      collate: 'utf8_general_ci',
    }
  );
  Post.associate = (db) => {
    db.Post.belongsTo(db.User);
    db.Post.belongsToMany(db.User, { through: 'Like', as: 'Likers' });
    db.Post.hasMany(db.Comment);
    db.Post.hasMany(db.Image);
    db.Post.belongsToMany(db.Hashtag);
    db.Post.belongsTo(db.Post, { as: 'Retweet' }); // 리트윗
  };
  return Post;
};
