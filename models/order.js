'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      order.belongsTo(models.user,{
        as: 'user',
        foreignKey: 'user_id'
      }),
      order.hasMany(models.order_item, {
        as: 'order_item',
        foreignKey: 'order_id'
      })
    }
  }
  order.init({
    payment_proof: DataTypes.STRING,
    total: DataTypes.INTEGER,
    status: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'order',
  });
  return order;
};