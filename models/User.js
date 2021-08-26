"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");

const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config.js");


class User {

  static async authenticate(username,  password){
      /** authenticate user with username, password.
   *
   * Returns { username, first_name, last_name, email, is_admin }
   *
   * Throws UnauthorizedError is user not found or wrong password.
   **/

    const result = await db.query(
      `SELECT username,
              password,
              first_name AS "firstName",
              last_name AS "lastName",
              email
        FROM users
        WHERE username = $1`,
        [username],
    )

    const user = result.rows[0];

    if(user){
      const isValid = await bcrypt.compare(password, user.password);
      if(isValid === true){
        delete user.password;
        return user;
      }
    }

    throw new UnauthorizedError("Invalid username/password");
  }

 /** Register user with data.
   *
   * Returns { username, firstName, lastName, email}
   *
   * Throws BadRequestError on duplicates.
   **/


  static async register({ username, first_name, last_name, email, password }) {

    const duplicateCheck = await db.query(
      `SELECT username
      FROM users
      WHERE username = $1`,
      [username]
    )

    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(`Duplicate username: ${username}`)
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    const result = await db.query(
      `INSERT INTO users(username, password, first_name, last_name, email)
        VALUES($1, $2, $3, $4, $5)
        RETURNING username, first_name AS "first name", last_name AS "last name", email`,
      [username, hashedPassword, first_name, last_name, email]);

    const user = result.rows[0];

    return user;
  }


  static async get(username) {
    const userRes = await db.query(
      `SELECT username,
        first_name AS "firstName",
        last_name as "lastName",
        email,
        is_admin AS "isAdmin"
        FROM users
        WHERE username = $1`
    )
  }




}