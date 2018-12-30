require('dotenv').config()

const express = require('express')
const validation = require('express-validation')
const Youch = require('youch')

class App {
  constructor () {
    this.express = express()
    this.isDev = process.env.NODE_ENV !== 'production'

    this.middlewares()
    this.routes()
    this.exception()
  }

  middlewares () {
    this.express.use(express.json())
  }

  routes () {
    this.express.use(require('./routes'))
  }

  exception () {
    this.express.use(async (err, req, res, next) => {
      if (err instanceof validation.ValidationError) {
        return res.status(err.status).json(err)
      }

      if (process.env.NODE_ENV !== 'production') {
        const youch = new Youch(err, req)

        return res.send(await youch.toHTML())
      }

      return res
        .json(err.status || 500)
        .json({ error: 'Internal server error.' })
    })
  }
}

module.exports = new App().express
