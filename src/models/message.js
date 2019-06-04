
export default (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    roomId: {
      references: { model: 'Rooms', key: 'id' },
      onDelete: 'CASCADE',
      allowNull: false,
      type: DataTypes.INTEGER
    },
    userId: {
      references: { model: 'Users', key: 'id' },
      onDelete: 'CASCADE',
      allowNull: false,
      type: DataTypes.INTEGER
    },
    message: {
      allowNull: false,
      type: DataTypes.TEXT
    },
  }, {});

  Message.associate = (models) => {
    Message.belongsTo(models.Room, {
      as: 'room',
      foreignKey: 'roomId'
    });
  };

  return Message;
};
