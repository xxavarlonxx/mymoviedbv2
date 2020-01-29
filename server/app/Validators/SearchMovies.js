'use strict'

class SearchMovies {
  get rules () {
    return {
      query: 'required|min:3'
    }
  }
}

module.exports = SearchMovies
