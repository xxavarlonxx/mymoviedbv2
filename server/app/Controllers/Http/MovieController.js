'use strict'

const Movie = use('App/Models/Movie');
const User = use('App/Models/User')
const axios = require('axios')
const Env = use('Env')

class MovieController {

    async getAll({auth}){
        const user = await auth.getUser()
        console.log(user)
        let movies = await Movie.findByOrFail('user_id', user.id)
        return movies
    }

    async create({request, response, auth}){
        const {tmdb_id, type} = request.all()
        const user= await auth.getUser()
        //let user = await User.findByOrFail('email', userAuth.email)

        try{
            const response = await axios.get('/configuration', {
                baseURL: Env.get('TMDB_BASE_URL'),
                params: {
                    api_key: Env.get('TMDB_API_KEY')
                }
            })

            const configuration = response.data.images
            const preferredPosterSize = Env.get('TMDB_THUMBNAIL_SIZE')
            let poster_size = 'original'
            configuration.poster_sizes.forEach(value => {
                if(value === preferredPosterSize){
                    poster_size = preferredPosterSize
                }
            })

            let imageBaseUrl = configuration.base_url + 'original'
            let imageThumbnailBaseUrl = configuration.base_url + poster_size

            const response2 = await axios.get('/movie/'+tmdb_id, {
                baseURL: Env.get('TMDB_BASE_URL'),
                params: {
                    language: Env.get('TMDB_LANGUAGE', 'de'),
                    api_key: Env.get('TMDB_API_KEY'),
                    append_to_response: 'credits'
                }
            })
            const tmdbData = response2.data

            var movie = await Movie.create({
                title: tmdbData.title,
                description: tmdbData.overview,
                release_date: tmdbData.release_date,
                cover_image_url: imageBaseUrl + tmdbData.poster_path,
                thumbnail_image_url: imageThumbnailBaseUrl + tmdbData.poster_path,
                type,
                tmdb_id
            })

            movie.user().associate(user)

            return movie

        }catch(e){
            console.log(e)
            return response.status(500).json({
                message: 'Internal server error occured. See log for more'
            })
        }


    }

    async getMovie({response, params}){
        const id = params.id
        const movie = await Movie.findByOrFail('id', id)

        try{
            const response = await axios.get('/movie/'+movie.tmdb_id, {
                baseURL: Env.get('TMDB_BASE_URL'),
                params: {
                    language: Env.get('TMDB_LANGUAGE', 'de'),
                    api_key: Env.get('TMDB_API_KEY'),
                    append_to_response: 'credits'
                }
            })
            const tmdbData = response.data

            let cast = tmdbData.credits.cast.map(item => {
                return {
                    name: item.name,
                    character: item.character
                }
            })

            if(cast.length > 4){
                cast = cast.slice(0,4)
            }

            let crew = tmdbData.credits.crew.map(item => {
                return {
                    name: item.name,
                    job: item.job
                }
            })

            if(crew.length > 4){
                crew = crew.slice(0,4)
            }

            let genres = tmdbData.genres.map(item => item.name)
            let directors = tmdbData.credits.crew.filter(item => item.job === 'Director')
            directors = directors.map(item => item.name)
            let producers = tmdbData.credits.crew.filter(item => item.job === 'Producer')
            producers = producers.map(item => item.name)

            if(directors.length > 4){
                directors = directors.slice(0,4)
            }

            if(producers.length > 4){
                producers = producers.slice(0,4)
            }

            let production_companies = tmdbData.production_companies
            production_companies.sort((a, b) => a.id > b.id ? 1 : -1)
            let production_company_obj = production_companies[0]
            let production_company = production_company_obj.name

            return {
                id: movie.id,
                title: movie.title,
                type: movie.type,
                description: movie.description,
                release_date: movie.release_date,
                cover_image_url: movie.cover_image_url,
                runtime: tmdbData.runtime,
                genres,
                cast,
                crew,
                directors,
                producers,
                production_company
            }
        }catch(e){
            //console.log(e)
            return response.status(500).json({
                message: 'Internal server error occured. See log for more',
                error: e
            })
        }
    }

    async update({request,response, params}){
        const id = params.id
        const {type} = request.all()

        let movie = await Movie.findByOrFail('id', id)

        try{
            movie.type = type
            await movie.save()
        }catch(e){
            return response.status(500).json({
                message: 'Internal server error occured. See log for more',
                error: e
            })
        }
        return movie
    }

    async delete({response, params}){
        const id = params.id
        let movie = await Movie.findByOrFail('id', id)

        try{
            movie.delete()
        }catch(e){
            return response.status(500).json({
                message: 'Internal server error occured. See log for more',
                error: e
            })
        }

        return response.json({
            message: 'Movie with ID '+ id + ' removed successfully'
        })
    }

    async fetchMovie(tmdb_id){
        const response = await axios.get('/movie/'+tmdb_id, {
            baseURL: Env.get('TMDB_BASE_URL'),
            params: {
                language: Env.get('TMDB_LANGUAGE', 'de'),
                api_key: Env.get('TMDB_API_KEY'),
                append_to_response: 'credits'
            }
        })
        return response.data
    }
}

module.exports = MovieController
