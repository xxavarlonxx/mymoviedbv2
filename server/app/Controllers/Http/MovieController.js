'use strict'

const Movie = use('App/Models/Movie');
const User = use('App/Models/User')
const axios = require('axios')
const Env = use('Env')

class MovieController {

    async search({request, response}){
        const {query} = request.all()
        try{
            let results = await this.searchMovie(query)

            let configuration = await this.fetchConfiguration()
            let baseUrl = configuration.base_url;
            const preferredPosterSize = Env.get('TMDB_THUMBNAIL_SIZE')
            let poster_size = 'original'
            configuration.poster_sizes.forEach(value => {
                if(value === preferredPosterSize){
                    poster_size = preferredPosterSize
                }
            })
    
            let imageBaseUrl = baseUrl + poster_size;
            results.sort((a,b) => a.popularity > b.popularity ? -1 : 1)
            let returnList = results.map(movie => {
                return {
                    title: movie.title,
                    release_date: movie.release_date,
                    tmdb_id: movie.id,
                    cover_url: imageBaseUrl + movie.poster_path
                }
            })
            return returnList
        }catch(e){
            return response.status(500).json({
                message: 'Internal server error occured. See log for more',
                error: e
            })
        }
    }

    async getAll({auth}){
        const user = await auth.getUser()
        let movies = await Movie.query().where('user_id', '=', user.id).fetch()
        return movies
    }

    async create({request, response, auth}){
        const {tmdb_id, type} = request.all()
        const user= await auth.getUser()

        try{
            
            const configuration = await this.fetchConfiguration()
            const preferredPosterSize = Env.get('TMDB_THUMBNAIL_SIZE')
            let poster_size = 'original'
            configuration.poster_sizes.forEach(value => {
                if(value === preferredPosterSize){
                    poster_size = preferredPosterSize
                }
            })

            let imageBaseUrl = configuration.base_url + 'original'
            let imageThumbnailBaseUrl = configuration.base_url + poster_size

            const tmdbData = await this.fetchMovie(tmdb_id)

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
            const tmdbData = await this.fetchMovie(movie.tmdb_id)
            
            //Cast
            let cast = this.mapCast(tmdbData.credits.cast)
            cast = this.sliceArray(cast, 4)
        
            //Crew
            let crew = this.mapCrew(tmdbData.credits.crew)
            crew =  this.sliceArray(crew, 4)

            let genres = tmdbData.genres.map(item => item.name)
            let directors = tmdbData.credits.crew.filter(item => item.job === 'Director')
            directors = directors.map(item => item.name)
            let producers = tmdbData.credits.crew.filter(item => item.job === 'Producer')
            producers = producers.map(item => item.name)

            directors = this.sliceArray(directors, 4)

            producers = this.sliceArray(producers, 4)

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

    async fetchConfiguration(){
        const response = await axios.get('/configuration', {
            baseURL: Env.get('TMDB_BASE_URL'),
            params: {
                api_key: Env.get('TMDB_API_KEY')
            }
        })

       return response.data.images
    }

    async searchMovie(query){
        const response = await axios.get('/search/movie',{
            baseURL: Env.get('TMDB_BASE_URL'),
            params:{
                language: Env.get('TMDB_LANGUAGE', 'de'),
                api_key: Env.get('TMDB_API_KEY'),
                query,
                region: ''+Env.get('TMDB_LANGUAGE', 'de').toUpperCase()
            }
        })
        return response.data.results
    }

    sliceArray(array, maxSize){
        var result = array
        if(array.length > maxSize){
            result = result.slice(0, maxSize)
        }
        return result
    }

    mapCast(array){
        let result = array.map(item => {
            return {
                name: item.name,
                character: item.character
            }
        })
        return result
    }

    mapCrew(array){
        let result = array.map(item => {
            return {
                name: item.name,
                job: item.job
            }
        })
        return result
    }
}

module.exports = MovieController
