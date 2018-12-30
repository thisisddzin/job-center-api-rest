const kue = require('kue')
const redisConfig = require('../../config/redis')
const job = require('../jobs')

const Queue = kue.createQueue({ redis: redisConfig })

Queue.process(job.CandidateMail.key, job.CandidateMail.handle)

module.exports = Queue
