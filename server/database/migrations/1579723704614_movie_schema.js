'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MovieSchema extends Schema {
  up () {
    this.create('movies', (table) => {
      table.increments()
      table.string('title').notNullable()
      table.text('description')
      table.string('cover_image_url')
      table.string('thumbnail_image_url')
      table.date('release_Date')
      table.integer('type').unsigned()
      table.integer('tmdb_id').unsigned()
      table
          .integer("user_id")
          .unsigned()
          .references("id")
          .inTable("users");
      table.timestamps()
    })
  }

  down () {
    this.drop('movies')
  }
}

module.exports = MovieSchema
