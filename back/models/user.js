module.exports = (sequelize, DataTypes) => {
  // 실제 테이블 이름은 users로 생성
  const User = sequelize.define(
    'User',
    {
      // id 는 고유한 값으로 데이터베이스에서 자동으로 넣어줌
      email: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      nickname: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
    },
    {
      charset: 'utf8',
      collate: 'utf8_general_ci',
    }
  );
  User.associate = (db) => {
    db.User.hasMany(db.Post);
    db.User.hasMany(db.Comment);
    db.User.belongsToMany(db.Post, { through: 'Like', as: 'Liked' }); // 좋아요
    db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followings', foreinKey: 'FollowingId' });
    db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followers', foreinKey: 'FollowerId' });
  };
  return User;
};
