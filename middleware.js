'use strict'

function createError (message) {
  const err = new Error(message || 'Unauthenticated request')

  err.status = 401

  return err
}

function isAuthenticated (req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  next(createError('Not authenticated'))
}

function redirectAuthenticated (url) {
  return function redirectAuthenticated (req, res, next) {
    if (req.isAuthenticated()) {
      res.redirect(url)
    } else {
      next()
    }
  }
}

function redirectUnauthenticated (url) {
  return function redirectUnauthenticated (error, req, res, next) {
    if (error.status === 401 && !(req.session && req.session.user)) {
      req.session.previousUrl = req.originalUrl
      res.redirect(url)
    } else {
      next(error)
    }
  }
}

module.exports = {
  isAuthenticated,
  redirectAuthenticated,
  redirectUnauthenticated,
}
