const Joi = require('joi')

module.exports = {
  body: {
    title: Joi.string().required(),
    description: Joi.string().required(),
    available: Joi.boolean(),
    salaries: Joi.number().required(),
    benefits: Joi.string().required()
  }
}
