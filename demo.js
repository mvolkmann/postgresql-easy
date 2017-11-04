const PgConnection = require('./index');
const pg = new PgConnection({
  //debug: true,
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'demo'
});

async function doIt() {
  // Note that user is a reserved table name.
  const tableName = 'demo_user';

  try {
    await pg.deleteAll(tableName);

    const id1 = await pg.insert(
      tableName, {username: 'batman', password: 'robin'});
    console.log('id1 =', id1);

    const id2 = await pg.insert(
      tableName, {username: 'joker', password: 'penguin'});
    console.log('id2 =', id2);

    let rows = await pg.getAll(tableName);
    console.log('all =', rows);

    await pg.updateById(
      tableName, id1, {username: 'batman', password: 'wayne'});

    const row = await pg.getById(tableName, id1);
    console.log('just id1 after update =', row);

    const sql = `select * from ${tableName} where password = $1`;
    rows = await pg.query(sql, 'wayne');
    console.log('query rows =', rows);

    await pg.deleteById(tableName, id1);

    rows = await pg.getAll(tableName);
    console.log('after deleting id1 =', rows);
  } catch (e) {
    console.error(e);
  } finally {
    pg.disconnect();
  }
}

doIt();
