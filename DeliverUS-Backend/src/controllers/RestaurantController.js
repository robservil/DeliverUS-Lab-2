import { Restaurant, Product, RestaurantCategory, ProductCategory } from '../models/models.js'

const index = async function (req, res) {
  try {
    const restaurants = await Restaurant.findAll(
      {
        attributes: { exclude: ['userId'] },
        include:
      {
        model: RestaurantCategory,
        as: 'restaurantCategory'
      },
        order: [[{ model: RestaurantCategory, as: 'restaurantCategory' }, 'name', 'ASC']]
      }
    )
    res.json(restaurants)
  } catch (err) {
    res.status(500).send(err)
  }
}

// TODO: Complete the following functions

const create = async function (req, res) {
  const newRestaurant = Restaurant.build(req.body)
  newRestaurant.userId = 1
  try {
    const restaurant = await newRestaurant.save()
    res.json(restaurant)
  } catch (err) {
    res.status(500).send(err)
  }
}

const show = async function (req, res) {
  try {
    const restaurantId = req.params.restaurantId
    const restaurant = await Restaurant.findByPk(
      restaurantId,
      {
        attributes: { exclude: ['userId'] },
        include: [
          {
            model: RestaurantCategory,
            as: 'restaurantCategory'
          },
          {
            model: Product,
            as: 'products',
            include: [
              {
                model: ProductCategory,
                as: 'productCategory'
              }
            ]
          }
        ],
        order: [[{ model: Product, as: 'products' }, 'order', 'ASC']]
      }
    )
    if (restaurant) {
      res.json(restaurant)
    } else {
      res.status(404).send('Restaurant not found')
    }
  } catch (err) {
    res.status(500).send(err)
  }
}

const update = async function (req, res) {
  try {
    const restaurantId = req.params.restaurantId
    await Restaurant.update(req.body, { where: { id: restaurantId } })
    const updatedRestaurant = await Restaurant.findByPk(restaurantId)
    res.json(updatedRestaurant)
  } catch (err) {
    res.status(500).send(err)
  }
}

const destroy = async function (req, res) {
  try {
    let message = ''
    const restaurantId = req.params.restaurantId
    const restaurant = await Restaurant.destroy(
      {
        where: { id: restaurantId }
      }
    )
    if (restaurant === 1) {
      message = 'Sucessfuly deleted restaurant id.' + restaurantId
    } else {
      message = 'Could not delete restaurant with id.' + restaurantId
    }
    res.json(message)
  } catch (err) {
    res.status(500).send(err)
  }
}

const RestaurantController = {
  index,
  create,
  show,
  update,
  destroy
}
export default RestaurantController
