const { Opportunity, User, Candidate } = require('../models')
// const { Op } = require('sequelize')
const CandidateMail = require('../jobs/CandidateMail')
const Queue = require('../services/Queue')

class CandidateController {
  async show (req, res) {
    const candidate = await Candidate.findByPk(req.params.id, {
      include: [
        { model: User, as: 'provider' },
        { model: User, as: 'candidate' },
        { model: Opportunity, as: 'opportunity' }
      ]
    })

    if (!candidate) {
      return res.status(400).json({ error: 'Esta oportunidade não existe.' })
    }

    const user = await User.findByPk(req.userId)

    if (user.provider) {
      if (candidate.provider_id !== req.userId) {
        return res
          .status(401)
          .json({ error: 'Você não pode visualizar essa candidatura.' })
      }

      return res.status(200).json(candidate)
    }

    if (candidate.candidate_id !== req.userId) {
      return res
        .status(401)
        .json({ error: 'Você não pode visualizar essa candidatura.' })
    }

    return res.status(200).json(candidate)
  }

  async store (req, res) {
    const { id } = req.params

    const opportunity = await Opportunity.findByPk(id, {
      include: [{ model: User, as: 'user' }]
    })

    const user = await User.findByPk(req.userId)

    if (!opportunity) {
      return res.status(400).json({ error: 'Esta oportunidade não existe' })
    }

    if (opportunity.provider_id === req.userId) {
      return res.status(401).json({ error: 'Você criou esta oportunidade.' })
    }

    Queue.create(CandidateMail.key, {
      user,
      opportunity
    }).save()

    const opCreated = await Candidate.create({
      opportunity_id: id,
      candidate_id: req.userId,
      provider_id: opportunity.provider_id
    })

    return res.json(opCreated)
  }

  async list (req, res) {
    const user = await User.findByPk(req.userId)

    if (user.provider) {
      const candidates = await Candidate.findAll({
        include: [
          { model: Opportunity, as: 'opportunity' },
          { model: User, as: 'candidate' }
        ],
        where: { provider_id: req.userId }
      })

      if (candidates.length < 1) {
        return res.json({ warn: 'Você não tem vaga alocada.' })
      }

      return res.json(candidates)
    }

    const candidates = await Candidate.findAll({
      include: [
        { model: Opportunity, as: 'opportunity' },
        { model: User, as: 'provider' }
      ],
      where: { candidate_id: req.userId }
    })

    if (candidates.length < 1) {
      return res.json({ warn: 'Você não tem vaga alocada.' })
    }

    return res.json(candidates)
  }

  async destroy (req, res) {
    const user = await User.findByPk(req.userId)

    const candidate = await Candidate.findByPk(req.params.id)

    if (!candidate) {
      return res.status(400).json({ error: 'Esta candidatura não existe.' })
    }

    if (candidate.candidate_id !== user.id) {
      return res.status(401).json({ error: 'Esta candidatura não é sua.' })
    }

    if (user.provider) {
      return res
        .status(401)
        .json({ error: 'Você não pode impedir uma candidatura.' })
    }

    await Candidate.destroy({ where: { id: req.params.id } })
    return res.send('Candidatura excluída com sucesso.')
  }
}
module.exports = new CandidateController()
