const { Category } = require('../db/db.js')
const { createCustomError } = require('../utils/customErrors')

const getCategories = async (_req, res) => {
  try {
    console.log(Category)
    const categories = await Category.findAll()
    //  crear un endpoint que agrege esto
    //
    // {
    //   include: {
    //     model: Product,
    //     as: 'products',
    //     attributes: ['idProd', 'name'],
    //     through: { attributes: [] }
    //   }
    // }

    res.status(200).json(categories)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const createCategories = async (req, res) => {
  try {
    const { name } = req.body
    console.log(name)
    const allowedCategories = [
      'electronics',
      'fashion and accessories',
      'home and decoration',
      'sports and fitness / health and wellness',
      'books and entertainment',
      'cars and motorcycles',
      'toys and kids',
      'personal care',
      'arts and crafts'
    ]

    if (!allowedCategories.includes(name)) {
      throw createCustomError(
        409,
        `The request could not be completed,Invalid category: ${name}`
      )
    }

    const existingCategory = await Category.findOne({
      where: {
        name
      }
    })

    if (existingCategory) {
      throw createCustomError(
        409,
        `The request could not be completed, Category ${name} already exists`
      )
    }

    const allCategories = await Category.findAll({
      attributes: ['name']
    })

    if (allCategories.length === allowedCategories.length) {
      throw createCustomError(
        409,
        'The request could not be completed, All categories have already been created'
      )
    }

    const categoryCreated = await Category.create({ name })

    res.status(201).json(categoryCreated)
  } catch (error) {
    res.status(error?.status || 500).json({ error: error?.message })
  }
}

module.exports = {
  getCategories,
  createCategories
}
