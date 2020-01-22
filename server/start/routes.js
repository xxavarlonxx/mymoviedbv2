'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')
const Helpers = use("Helpers");

Route.group(() => {
    Route.post('login', 'LoginController.login')
    Route.post('signin','LogiNController.signin')
}).middleware(['guest']).prefix('api')

Route.group(() => {
    Route.get('movies', 'MovieController.getAll')
    Route.post('movies', 'MovieController.create')
    Route.post('movies/search', 'TMDBController.search')
}).middleware(['auth']).prefix('api')

Route.any("*", async ({ response }) => {
    return response.download(Helpers.publicPath("main.html"));
  });