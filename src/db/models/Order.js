const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  sequelize.define(
    'Orders',
    {
      idOrder: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      payment_id: {
        type: DataTypes.INTEGER
      },
      status: {
        type: DataTypes.ENUM('approved', 'pending', 'rejected')
      },
      merchant_order_id: {
        type: DataTypes.INTEGER
      }
    },
    {
      comment: 'Table containing information about orders',
      tableName: 'orders'
    }
  ) /// falta completar cosas
}
