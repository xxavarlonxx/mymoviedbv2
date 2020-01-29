'use strict'

const axios = require('axios')
const Env = use('Env')


class TmdbController {

    async search({request, response}){
        const {query} = request.all()
        try{
            const response = await axios.get('/search/movie',{
                baseURL: Env.get('TMDB_BASE_URL'),
                params:{
                    language: Env.get('TMDB_LANGUAGE', 'de'),
                    api_key: Env.get('TMDB_API_KEY'),
                    query,
                    region: ''+Env.get('TMDB_LANGUAGE', 'de').toUpperCase()
                }
            })

            const results = response.data.results
            return results
        }catch(e){
            return response.status(500).json({
                message: 'Internal server error occured. See log for more'
            })
        }
    }
}

module.exports = TmdbController
