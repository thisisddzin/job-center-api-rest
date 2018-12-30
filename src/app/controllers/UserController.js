const { User } = require('../models')

class UserController {
  async store (req, res) {
    const userExist = await User.findOne({ where: { email: req.body.email } })

    if (userExist) {
      return res.status(409).json({ error: 'Usuário Existente.' })
    }

    const user = await User.create(req.body)

    return res.json(user)
  }

  async list (req, res) {
    const users = await User.findAll()

    return res.json(users)
  }
}

module.exports = new UserController()
