const sequelizePaginate = require('sequelize-paginate')

module.exports = (Sequelize, DataTypes) => {
  const Candidate = Sequelize.define('Candidate', {
    title: DataTypes.STRING
  })

  Candidate.associate = models => {
    Candidate.belongsTo(models.Opportunity, {
      as: 'opportunity',
      foreignKey: 'opportunity_id'
    })
    Candidate.belongsTo(models.User, {
      as: 'candidate',
      foreignKey: 'candidate_id'
    })
    Candidate.belongsTo(models.User, {
      as: 'provider',
      foreignKey: 'provider_id'
    })
  }

  sequelizePaginate.paginate(Candidate)

  return Candidate
}
