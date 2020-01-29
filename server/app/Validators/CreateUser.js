'use strict'

class CreateUser {
  get rules () {
    return {
      email: 'required|email|unique:users',
      password: 'required|min:8',
      name: 'required'
    }
  }
}

module.exports = CreateUser
