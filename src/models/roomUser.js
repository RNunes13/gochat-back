
export default (sequelize, DataTypes) => {
  const RoomUser = sequelize.define('RoomUser', {
    roomId: {
      references: { model: 'Rooms', key: 'id' },
      onDelete: 'CASCADE',
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    userId: {
      references: { model: 'Users', key: 'id' },
      onDelete: 'CASCADE',
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
  }, {});

  return RoomUser;
};
