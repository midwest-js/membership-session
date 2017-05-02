'use strict';

const _ = require('lodash');
const req = require('http').IncomingMessage.prototype;

module.exports = ({ serialize, deserialize }) => {
  if (!_.isFunction(serialize) || !_.isFunction(deserialize)) {
    throw new TypeError('Both arguments need to be functions');
  }

  req.login = function (user) {
    if (!this.session) {
      return Promise.reject(new Error('Session middleware not in use'));
    } else {
      return serialize(user).then((result) => {
        this.session.user = result;

        return user;
      }).catch((err) => {
        delete this.sesson.user;

        throw err;
      });
    }
  };

  req.logout = function () {
    delete this.session.user;
    delete this.__promise;
  };

  req.isAuthenticated = function () {
    return this.session && this.session.user;
  };

  req.isUnauthenticated = function () {
    return !this.isAuthenticated();
  };

  Object.defineProperty(req, 'user', {
    get() {
      if (!this.session || !this.session.user) {
        return Promise.resolve(null)
      } else if (!this.__promise) {
        this.__promise = deserialize(this.session.user).catch((err) => {
          // TODO decide on how to handle errors
          console.error(err);
        });
      }

      return this.__promise;
    }
  });

  req.getUser = function () {
    if (this.user) return Promise.resolve(this.user);

    if (!this.session || !this.session.user) {
      return Promise.resolve(null);
    } else if (!this.__promise) {
      this.__promise = deserialize(this.session.user).catch((err) => {
        console.error(err);
      });
    }

    return this.__promise;
  };
};
