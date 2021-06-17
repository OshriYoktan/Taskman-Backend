const logger = require('../services/logger.service')

async function log(req, res, next) {
  if (req.session && req.session.user) {
    logger.info('Req from: ' + req.session.user.name)
  }
  next()
}

module.exports = {
  log
}
