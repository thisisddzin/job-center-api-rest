const express = require('express')
const validation = require('express-validation')
const handle = require('express-async-handler')

const routes = express.Router()

const controller = require('./app/controllers')
const validate = require('./app/validators')

const auth = require('./app/middlewares/auth')

routes.get('/', (req, res) => res.redirect('/opportunities'))

routes.post(
  '/signin',
  validation(validate.Session),
  handle(controller.SessionController.store)
)

routes.post(
  '/signup',
  validation(validate.User),
  handle(controller.UserController.store)
)

routes.use(auth)

routes.get('/users', handle(controller.UserController.list))

routes.get('/opportunities', handle(controller.OpportunityController.list))
routes.get('/opportunities/:id', handle(controller.OpportunityController.show))
routes.post(
  '/opportunities',
  validation(validate.Opportunity),
  handle(controller.OpportunityController.store)
)
routes.put(
  '/opportunities/:id',
  validation(validate.Opportunity),
  handle(controller.OpportunityController.update)
)
routes.delete(
  '/opportunities/:id',
  handle(controller.OpportunityController.destroy)
)

routes.post('/candidates/:id', handle(controller.CandidateController.store))
routes.get('/candidates', handle(controller.CandidateController.list))
routes.get('/candidates/:id', handle(controller.CandidateController.show))
routes.delete('/candidates/:id', handle(controller.CandidateController.destroy))

module.exports = routes
