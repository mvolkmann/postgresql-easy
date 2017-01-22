const pg = require('pg');
let debug = false;
let pool;

/**
 * Configures a PostgreSQLconnection pool.
 * This must be called before the other functions.
 * If not, a "pool not configured" error will be thrown.
 *
 * The config object can contain these properties:
 *   database: the name of the database to use
 *   debug: true to output messages describing each action; defaults to false
 *   host: defaults to localhost
 *   idleTimeoutMillis: time before a client is closed; default is 30000
 *   max: maximum number of clients in pool; default is 10
 *   password: if database requires authentication
 *   port: defaults to 5432
 *   user: if database requires authentication
 *
 * The only one of these that is always required is "database".
 */
function configure(config) {
  pool = new pg.Pool(config);
  debug = config.debug;
}

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

function log(...msg) {
  if (debug) console.log('pg-simple.js:', msg.join(' '));
}

/**
 * Deletes all records from a given table.
 */
function deleteAll(tableName) {
  const sql = 'delete from ' + tableName;
  log('deleteAll: sql =', sql);
  return query(sql);
}

/**
 * Deletes a record from a given table by id.
 * This requires the table to have a column named "id".
 */
function deleteById(tableName, id) {
  const sql = `delete from ${tableName} where id=${id}`;
  log('delete: sql =', sql);
  return query(sql);
}

/**
 * Disconnects from the database.
 */
function disconnect() {
  log('disconnecting');
  if (pool) pool.end();
}

/**
 * Gets all records from a given table.
 */
function getAll(tableName) {
  const sql = 'select * from ' + tableName;
  log('getAll: sql =', sql);
  return query(sql);
}

/**
 * Gets a record from a given table by id.
 * This requires the table to have a column named "id".
 */
function getById(tableName, id) {
  const sql = `select * from ${tableName} where id=${id}`;
  log('getById: sql =', sql);
  return query(sql);
}

/**
 * Inserts a record into a given table.
 * The keys of obj must be column names
 * and their values are the values to insert.
 */
function insert(tableName, obj) {
  const keys = Object.keys(obj);
  const values = keys.map(key => obj[key]);
  const cols = keys.join(',');
  const placeholders =
    values.map((v, index) => '$' + (index + 1)).join(',');
  const sql =
    `insert into ${tableName} (${cols}) values(${placeholders}) returning id`;
  log('insert: sql =', sql);
  return query(sql, ...values);
}

/**
 * Executes a SQL query.
 * It is the most general purpose function provided.
 * This is used by several of the other functions.
 */
function query(sql, ...params) {
  return new Promise((resolve, reject) => {
    if (!pool) return reject('pool not configured');

    pool.connect((err, client, done) => {
      if (err) return reject(err);
      log('query: sql =', sql);
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
function updateById(tableName, id, obj) {
  const sets = Object.keys(obj).map(key => {
    const v = obj[key];
    const value = typeof v === 'string' ? `'${v}'` : v;
    return `${key}=${value}`;
  });
  const sql = `update ${tableName} set ${sets} where id=${id}`;
  log('update: sql =', sql);
  return query(sql);
}

module.exports = {
  configure, deleteAll, deleteById, disconnect,
  getAll, getById, insert, query, updateById
};
