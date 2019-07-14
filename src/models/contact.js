
export default (sequelize, DataTypes) => {
  const Contact = sequelize.define('Contact', {
    ownerId: {
      references: { model: 'Users', key: 'id' },
      onDelete: 'CASCADE',
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    contactId: {
      references: { model: 'Users', key: 'id' },
      onDelete: 'CASCADE',
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
  }, {});

  return Contact;
};
