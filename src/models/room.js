
export default (sequelize, DataTypes) => {
  const Room = sequelize.define('Room', {
    name: {
      type: DataTypes.STRING
    },
  }, {});

  Room.associate = (models) => {
    Room.belongsToMany(models.User, {
      through: 'RoomUser',
      as: 'users',
      foreignKey: 'roomId'
    });
  };

  return Room;
};
