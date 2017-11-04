This is a Node module that makes it very simple
to interact with PostgreSQL databases.
It has the same API as mysql-easier.

To install this, run `npm install -S postgresql-easy`

To use this,
```js
const PgConnection = require('postgresql-easy');
const pg = new PgConnection(config);
```

The config object can contain these properties:
* `database`: the name of the database to use
* `debug`: true to output messages describing each action; defaults to false
* `host`: defaults to localhost
* `idleTimeoutMillis`: time before connection is closed; default is 30000
* `max`: maximum number of clients in pool; default is 10
* `password`: if database requires authentication
* `port`: defaults to 5432
* `user`: if database requires authentication

The only one of these that is always required is "database".

PgConnection objects provide seven methods.
All but `disconnect` return a promise.
One way to use the returned promise is to chain calls to `then` and `catch`.
Another is to use `async` and `await`.

## `deleteAll`
This deletes all records from a given table.

```js
pg.deleteAll('flavors')
  .then(() => {
    // Do something after successful delete.
  })
  .catch(err => {
    // Handle the error.
  });
```

## `deleteById`
This deletes a record from a given table by id.
It requires the table to have a column named "id".

```js
pg.delete('flavors', 7)
  .then(() => {
    // Do something after successful delete.
  })
  .catch(err => {
    // Handle the error.
  });
```

## `disconnect`
This disconnects from the database.

```js
pg.disconnect();
```

## `getAll`
This gets all records from a given table.

```js
pg.getAll('flavors')
  .then(result => {
    // Process data in the array result.rows.
  })
  .catch(err => {
    // Handle the error.
  });
```

## `getById`
This gets a record from a given table by id.
It requires the table to have a column named "id".

```js
pg.getById('flavors', 7)
  .then(result => {
    // Process data in the array result.rows.
  })
  .catch(err => {
    // Handle the error.
  });
```

## `insert`
This inserts a record into a given table
and returns the id of the new record.
The keys of obj are column names
and their values are the values to insert.

```js
pg.insert('flavors', {name: 'vanilla', calories: 100})
  .then(result => {
    // Do something after successful insert.
    // result.rows[0] will be an object describing the inserted row.
  })
  .catch(err => {
    // Handle the error.
  });
```

## `query`
This executes a SQL query.
It is the most general purpose function provided.
It is used by several of the other functions.

```js
pg.query('select name from flavors where calories < 150')
  .then(result => {
    // Do something with the result set in result.rows.
  })
  .catch(err => {
    // Handle the error.
  });

const sql = 'select name from flavors where calories < $1 and cost < $2';
pg.query(sql, 200, 3)
  .then(result => {
    // Do something with the result set in result.rows.
  })
  .catch(err => {
    // Handle the error.
  });
```

## `updateById`
This updates a record in a given table by id.
It requires the table to have a column named "id".

```js
pg.updateById('flavors', 7, {name: 'chocolate', calories: 200})
  .then(result => {
    // Do something with the result set in result.rows.
    // result.rows[0] will be an object describing the updated row.
  })
  .catch(err => {
    // Handle the error.
  });
```

## Demo
To run the demo code, follow these steps:
1) Start database daemon with "pg_ctl -D /usr/local/var/postgres start".
2) Create the demo database with "createdb demo".
3) Start interactive mode with "psql -d demo".
4) Create a table with
   create table demo_user (
     id serial primary key,
     username text,
     password text
   );
5) Exit interactive mode with ctrl-d.
6) Run the demo with "npm run demo".
