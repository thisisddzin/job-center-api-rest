const Mail = require('../services/Mail')

class CandidateMail {
  get key () {
    return 'CandidateMail'
  }

  async handle (job, done) {
    const { user, opportunity } = job.data

    await Mail.sendMail({
      from: `${user.name} <${user.email}>`,
      to: opportunity.user.email,
      subject: `Um novo candidato para sua vaga de ${opportunity.title}`,
      template: 'candidate',
      context: { user, opportunity }
    })

    return done()
  }
}

module.exports = new CandidateMail()
