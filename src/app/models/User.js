const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

module.exports = (Sequelize, DataTypes) => {
  const User = Sequelize.define(
    'User',
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      academic: DataTypes.STRING,
      provider: DataTypes.BOOLEAN
    },
    {
      hooks: {
        beforeSave: async user => {
          if (user.password) {
            user.password = await bcrypt.hash(user.password, 8)
          }
        }
      }
    }
  )

  User.prototype.checkPass = function (password) {
    return bcrypt.compare(password, this.password)
  }

  User.prototype.generateToken = function ({ id }) {
    return jwt.sign({ id }, 'app-secret', { expiresIn: 86400 })
  }

  return User
}
