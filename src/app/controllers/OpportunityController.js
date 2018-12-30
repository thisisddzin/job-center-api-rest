const { User, Opportunity } = require('../models')
const { Op } = require('sequelize')

class OpportunityController {
  async show (req, res) {
    const opportunity = await Opportunity.findByPk(req.params.id)

    if (!opportunity) {
      return res.status(400).json({ error: 'oportunidade não encontrada' })
    }

    return res.json(opportunity)
  }

  async store (req, res) {
    const user = await User.findByPk(req.userId)

    if (!user.provider) {
      return res
        .status(401)
        .json({ error: 'Você não é um provedor de empregos.' })
    }

    const opportunity = await Opportunity.create({
      ...req.body,
      provider_id: req.userId
    })

    return res.json({
      success: 'Oportunidade criada com sucesso.',
      opportunity
    })
  }

  async list (req, res) {
    const filters = {}

    if (req.query.title) {
      filters.title = { [Op.like]: `%${req.query.title}%` }
    }

    const options = {
      page: req.query.page || 1, // Default 1
      paginate: 10,
      include: [{ model: User, as: 'user' }],
      order: [['updated_at', 'DESC']],
      where: { ...filters, available: true }
    }

    const { docs, pages, total } = await Opportunity.paginate(options)

    return res.json({ docs, pages, total })
  }

  async destroy (req, res) {
    const { id } = req.params

    const opportunity = await Opportunity.findByPk(id)

    if (!opportunity) {
      return res.status(400).json({ error: 'oportunidade não encontrada' })
    }

    if (opportunity.provider_id !== req.userId) {
      return res
        .status(401)
        .json({ error: 'Você não é o dono dessa oportunidade.' })
    }

    await Opportunity.destroy({ where: { id } })

    return res.json({ success: 'Oportunidade excluida' })
  }

  async update (req, res) {
    const { id } = req.params
    const opportunity = await Opportunity.findByPk(id)

    if (!(opportunity.provider_id === req.userId)) {
      return res.json({ error: 'Vocẽ não é o dono dessa oportunidade.' })
    }

    await Opportunity.update(req.body, {
      where: { id }
    })

    return res.json(req.body)
  }
}

module.exports = new OpportunityController()
