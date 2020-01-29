'use strict'

class CreateMovie {
  get rules () {
    return {
      tmdb_id: 'required',
      type: 'required'
    }
  }
}

module.exports = CreateMovie
