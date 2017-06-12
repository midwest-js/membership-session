'use strict'

const factory = require('./methods')

module.exports = ({ userGetter, serialize, deserialize, target }) => {
  const methods = factory({ serialize, deserialize })

  Object.assign(target, methods)

  if (userGetter === true) {
    Object.defineProperty(target, 'user', {
      get () {
        return this.getUser()
      },
      enumerable: true,
      configurable: true,
    })
  }
}
