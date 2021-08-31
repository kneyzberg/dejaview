"use strict";

const db = require("../db");
const {sqlForPartialUpdate} = require("../helpers/sql"); 
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

class Movie {
  /* get */
  static async get(movieId){
    const movieRes = await db.query(
      `SELECT id,
       title,
       year,
       image_url AS "imageUrl"
       FROM movies
       WHERE id = $1`,
     [movieId]
   );
   
   const movie = movieRes.rows[0];
   if (!movie) throw new NotFoundError(`No movie with id ${movieId}`);
   return movie;
  }

  /* create */
  static async create({title, year, image_url}){
    const duplicateCheck = await db.query(
      `SELECT title,
       year
       FROM movies
       WHERE title = $1 AND year = $2`,
       [title,year]
    )
    if (duplicateCheck.rows[0]){
      throw new BadRequestError(`Duplicate movie: ${title} (${year})`)
    }
    const result = await db.query(
      `INSERT INTO movies(title, year, image_url)
       VALUES($1, $2, $3)
       RETURNING id, title, year, image_url AS "imageUrl"`,
       [title, year, image_url]
    );
    const movie = result.rows[0];
    return movie;
  }

  /* delete */
  static async remove(movieId){
    let result = await db.query(
      `DELETE
       FROM movies
       WHERE id = $1
       RETURNING title`,
       [movieId],
    );
    const movie = result.rows[0];
    if (!movie) throw new NotFoundError(`No movie: ${movieId}`);
  }
  /* update */
  static async update(movieId, data){
   const {setCols, values} = sqlForPartialUpdate(
     data,
     {
       imageUrl: "image_url"
     }
   );
   const movieVarIdx = "$" + (values.length + 1);

   const querySql = `UPDATE movies
 		     SET ${setCols}
 		     WHERE id = ${movieVarIdx}
		     RETURNING id,
 			       title,
			       year,
			       image_url`;
    const result = await db.query(querySql, [...values, username]);
    const movie = result.rows[0];

    if (!movie) throw new NotFoundError(`No movie: ${movieId}`);
    return movie;
  }  
}
