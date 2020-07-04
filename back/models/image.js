module.exports = (sequelize, DataTypes) => {
  const Image = sequelize.define(
    'Image',
    {
      src: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    {
      charset: 'utf8', // 이모티콘까지
      collate: 'utf8_general_ci',
    }
  );

  // 관계 설정
  Image.associate = (db) => {
    db.Images.belongsTo(db.Post);
  };
  return Image;
};
