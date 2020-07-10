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
      collate: 'utf8mb4_general_ci',
    }
  );
  Post.associate = (db) => {
    db.Post.belongsTo(db.User); // post.addUser, post.getUser, post.setUser, post.removeUser
    db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' }); // post.addHashtags, post.removeHashtags...
    db.Post.belongsToMany(db.User, { through: 'Like', as: 'Likers' }); // post.addLikers, post.removeLikers...
    db.Post.hasMany(db.Comment); // post.addComments, posts.getComments...
    db.Post.hasMany(db.Image); // posts.addImages, post.getImages...
    db.Post.belongsTo(db.Post, { as: 'Retweet' }); // post.addRetweet ...
  };
  return Post;
};
