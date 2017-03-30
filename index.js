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
    if (this.debug) console.log('pg-simple.js:', msg.join(' '));
  }

  /**
   * Deletes all records from a given table.
   */
  deleteAll(tableName) {
    const sql = 'delete from $1';
    this.log('deleteAll: sql =', sql);
    return this.query(sql, tableName);
  }

  /**
   * Deletes a record from a given table by id.
   * This requires the table to have a column named "id".
   */
  deleteById(tableName, id) {
    const sql = 'delete from $1 where id=$2';
    this.log('delete: sql =', sql);
    return this.query(sql, tableName, id);
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
    const sql = 'select * from $1';
    this.log('getAll: sql =', sql);
    return this.query(sql, tableName);
  }

  /**
   * Gets a record from a given table by id.
   * This requires the table to have a column named "id".
   */
  getById(tableName, id) {
    const sql = 'select * from $1 where id=$2';
    this.log('getById: sql =', sql);
    return this.query(sql, tableName, id);
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
    const placeholders = values.map((v, index) => '$' + (index + 3)).join(',');
    const sql = 'insert into $1 ($2) values(${placeholders}) returning id';
    this.log('insert: sql =', sql);
    return this.query(sql, tableName, cols, ...values);
  }

  /**
   * Executes a SQL query.
   * It is the most general purpose function provided.
   * This is used by several of the other functions.
   */
  query(sql, ...params) {
    return new Promise((resolve, reject) => {
      if (!this.pool) return reject('pool not configured');

      this.pool.connect((err, client, done) => {
        if (err) return reject(err);
        this.log('query: sql =', sql);
        client.query(sql, params, (err, result) => {
          handle(resolve, reject, err, result);
          done();
        });
      });
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
    const sql = 'update $1 set $2 where id=$3';
    this.log('update: sql =', sql);
    return this.query(sql, tableName, sets, id);
  }
}

module.exports = PgConnection;
