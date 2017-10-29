'use strict'

const _ = require('lodash')
const Promise = require('bluebird')

module.exports = ({ userGetter, serialize, deserialize }) => {
  if (!_.isFunction(serialize) || !_.isFunction(deserialize)) {
    throw new TypeError('Both arguments need to be functions')
  }

  const obj = {
    login (user, { remember } = {}) {
      if (!this.session) {
        Promise.resolve('Session middleware not in use')
      } else {
        return Promise.try(() => serialize(user)).then((result) => {
          this.session.user = result

          if (remember) {
            if (state.remember.expires) {
              this.session.cookie.expires = state.remember.expires
            } else {
              this.session.cookie.maxAge = state.remember && state.remember.maxAge
            }
          }

          const saveSession = Promise.promisify(this.session.save, { context: this.session })

          return saveSession()
        })
      }
    },

    logout () {
      const destroySession = Promise.promisify(this.session.destroy, { context: this.session })

      return destroySession()
    },

    isAuthenticated () {
      return this.session && this.session.user
    },

    isUnauthenticated () {
      return !this.isAuthenticated()
    },

    getUser () {
      if (!this.session || !this.session.user) {
        return Promise.resolve(null)
      } else if (!this.__userPromise) {
        this.__userPromise = Promise.try(() => deserialize(this.session.user)).catch((err) => {
          // TODO
          console.error(err)
        })
      }

      return this.__userPromise
    },
  }

  return obj
}
