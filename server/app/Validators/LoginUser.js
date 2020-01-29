'use strict'

class LoginUser {
  get rules () {
    return {
      email: 'required|email',
      password: 'required|min:8'
    }
  }
}

module.exports = LoginUser
