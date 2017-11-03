const pg = require('pg');

/**
 * Helper function for working with ES6 promises.
 */
function handle(resolve, reject, err, result) {
  if (err) {
    reject(err);
  } else {
    resolve(result);
  }
}

class PgConnection {

  /**
   * This configures a PostgreSQLconnection pool.
   * The object created can be used to interact with a given database.
   *
   * To use this,
   * const PgConnection = require('postgresql-easy');
   * const pg = new PgConnection(config);
   *
   * The config object can contain these properties:
   *   database: the name of the database to use
   *   debug: true to output messages describing each action; defaults to false
   *   host: defaults to localhost
   *   idleTimeoutMillis: time before the connection is closed; default is 30000
   *   max: maximum number of clients in pool; default is 10
   *   password: if database requires authentication
   *   port: defaults to 5432
   *   user: if database requires authentication
   *
   * The only one of these that is always required is "database".
   */
  constructor(config) {
    this.pool = new pg.Pool(config);
    this.debug = config.debug;
  }

  log(...msg) {
    if (this.debug) console.log('postgresql-easy.js:', msg.join(' '));
  }

  /**
   * Deletes all records from a given table.
   */
  deleteAll(tableName) {
    const sql = `delete from ${tableName}`;
    this.log('deleteAll: sql =', sql);
    return this.query(sql);
  }

  /**
   * Deletes a record from a given table by id.
   * This requires the table to have a column named "id".
   */
  deleteById(tableName, id) {
    const sql = `delete from ${tableName} where id=$1`;
    this.log('delete: sql =', sql);
    return this.query(sql, id);
  }

  /**
   * Disconnects from the database.
   */
  disconnect() {
    this.log('disconnecting');
    if (this.pool) {
      this.pool.end();
      this.pool = null;
    }
  }

  /**
   * Gets all records from a given table.
   */
  getAll(tableName) {
    const sql = `select * from ${tableName}`;
    this.log('getAll: sql =', sql);
    return this.query(sql);
  }

  /**
   * Gets a record from a given table by id.
   * This requires the table to have a column named "id".
   */
  getById(tableName, id) {
    const sql = `select * from ${tableName} where id=$1`;
    this.log('getById: sql =', sql);
    return this.query(sql, id);
  }

  /**
   * Inserts a record into a given table.
   * The keys of obj are column names
   * and their values are the values to insert.
   */
  insert(tableName, obj) {
    const keys = Object.keys(obj);
    const values = keys.map(key => obj[key]);
    const cols = keys.join(',');
    const placeholders = values.map((v, index) => '$' + (index + 1)).join(',');
    const sql = `insert into ${tableName} (${cols}) values(${placeholders}) returning id`;
    this.log('insert: sql =', sql);
    return this.query(sql, ...values);
  }

  /**
   * Executes a SQL query.
   * It is the most general purpose function provided.
   * This is used by several of the other functions.
   */
  query(sql, ...params) {
    return new Promise((resolve, reject) => {
      if (!this.pool) return reject('pool not configured');

      this.pool.query(sql, params, (err, result) =>
        handle(resolve, reject, err, result));
    });
  }

  /**
   * Updates a record in a given table by id.
   * This requires the table to have a column named "id".
   */
  updateById(tableName, id, obj) {
    const sets = Object.keys(obj).map(key => {
      const v = obj[key];
      const value = typeof v === 'string' ? `'${v}'` : v;
      return `${key}=${value}`;
    });
    const sql = `update ${tableName} set ${sets} where id=$1`;
    this.log('update: sql =', sql);
    return this.query(sql, id);
  }
}

module.exports = PgConnection;
