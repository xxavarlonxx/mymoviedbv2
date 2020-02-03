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
    Route.post('login', 'LoginController.login').validator('LoginUser')
    Route.post('signup','LoginController.signup').validator('CreateUser')
}).middleware(['guest']).prefix('api')

Route.group(() => {
    Route.get('movies', 'MovieController.getAll')
    Route.get('movie/:id','MovieController.getMovie')
    Route.post('movie', 'MovieController.create').validator('CreateMovie')
    Route.put('movie/:id', 'MovieController.update').validator('UpdateMovie'),
    Route.delete('movie/:id', 'MovieController.delete')
    Route.post('movies/search', 'MovieController.search').validator('SearchMovies')
}).middleware(['auth']).prefix('api')

Route.any("*", async ({ response }) => {
    return response.download(Helpers.publicPath("main.html"));
  });