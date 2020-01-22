'use strict'

const Movie = use('App/Models/Movie');

class MovieController {

    async getAll({request, response, auth}){
        const currentUser = auth.getUser()


    }

    async create({request, response, auth}){
        
    }
}

module.exports = MovieController
