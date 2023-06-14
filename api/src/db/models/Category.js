const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  sequelize.define(
    'Category',
    {
      idCategory: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        unique: true
        // allowNull: false
      },
      name: {
        // ya arregle las categorias
        type: DataTypes.ENUM(
          'electronico',
          'moda y accesorios',
          'hogar y decoración',
          'deportes y fitness / salud y bienestar',
          'libros y entretenimiento',
          'automovil y motocicletas',
          'jueguetes y niños',
          'cuidado personal',
          'artes y manualidades'
        ),
        allowNull: false
      }
    },
    {
      comment: 'Table containing information about categories',
      tableName: 'categories'
    }
  )
}
