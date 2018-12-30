const sequelizePaginate = require('sequelize-paginate')

module.exports = (Sequelize, DataTypes) => {
  const Opportunity = Sequelize.define('Opportunity', {
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    available: DataTypes.BOOLEAN,
    salaries: DataTypes.DECIMAL,
    benefits: DataTypes.TEXT
  })

  Opportunity.associate = models => {
    Opportunity.belongsTo(models.User, {
      as: 'user',
      foreignKey: 'provider_id'
    })
  }

  sequelizePaginate.paginate(Opportunity)

  return Opportunity
}
