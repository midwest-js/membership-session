'use strict';

function createError(message) {
  const err = new Error(message || 'Unauthenticated request');

  err.status = 401;

  return err;
}

const isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  next(createError('Not authenticated'));
};

module.exports = {
  isAuthenticated,
};
