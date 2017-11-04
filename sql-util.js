class SqlUtil {

  constructor(pool, debug) {
    this.pool = pool;
    this.debug = debug;
  }

  log(...msg) {
    if (this.debug) console.log('postgresql-easy', msg.join(' '));
  }

  /**
   * Deletes all records from a given table.
   */
  deleteAll(tableName) {
    const sql = `delete from ${tableName}`;
    this.log('deleteAll: sql =', sql);
    return sql;
  }

  /**
   * Deletes a record from a given table by id.
   * This requires the table to have a column named "id".
   */
  deleteById(tableName /*, id*/) {
    const sql = `delete from ${tableName} where id=$1`;
    this.log('deleteById: sql =', sql);
    return sql;
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
    return sql;
  }

  /**
   * Gets a record from a given table by id.
   * This requires the table to have a column named "id".
   */
  getById(tableName /*, id*/) {
    const sql = `select * from ${tableName} where id=$1`;
    this.log('getById: sql =', sql);
    return sql;
  }

  /**
   * Inserts a record into a given table.
   * The keys of obj are column names
   * and their values are the values to insert.
   */
  insert(tableName, obj) {
    const keys = Object.keys(obj);
    const values = keys.map(key => obj[key]);
    const cols = keys.join(', ');
    const placeholders = values.map((v, index) => '$' + (index + 1)).join(', ');
    const sql =
      `insert into ${tableName} (${cols}) values(${placeholders}) returning id`;
    this.log('insert: sql =', sql);
    return sql;
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
    return sql;
  }
}

module.exports = SqlUtil;
