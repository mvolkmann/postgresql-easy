This is a Node module that makes it very simple
to interact with a single PostgreSQL database.

To install this, run `npm install -S postgresql-easy`.

To use this, `const pg = require('postgresql-easy');`

This module provides seven functions.

## `configure`
This configures a PostgreSQLconnection pool.
It must be called before the other functions.
If not, a "pool not configured" error will be thrown.

````
pg.configure({database: 'ice-cream'});
````

The config object can contain these properties:
* `database`: the name of the database to use
* `debug`: true to output messages describing each action; defaults to false
* `host`: defaults to localhost
* `idleTimeoutMillis`: time before a client is closed; default is 30000
* `max`: maximum number of clients in pool; default is 10
* `password`: if database requires authentication
* `port`: defaults to 5432
* `user`: if database requires authentication

The only one of these that is always required is "database".

## `deleteAll`
This deletes all records from a given table.

````
pg.deleteAll('flavors')
  .then(() => {
    // Do something after successful delete.
  })
  .catch(err => {
    // Handle the error.
  });
````

## `deleteById`
This deletes a record from a given table by id.
It requires the table to have a column named "id".

````
pg.delete('flavors', 7)
  .then(() => {
    // Do something after successful delete.
  })
  .catch(err => {
    // Handle the error.
  });
````

## `disconnect`
This disconnects from the database.

````
pg.disconnect();
````

## `getAll`
This gets all records from a given table.

````
pg.getAll('flavors')
  .then(result => {
    // Process data in the array result.rows.
  })
  .catch(err => {
    // Handle the error.
  });
````

## `getById`
This gets a record from a given table by id.
It requires the table to have a column named "id".

````
pg.getById('flavors', 7)
  .then(result => {
    // Process data in the array result.rows.
  })
  .catch(err => {
    // Handle the error.
  });
````

## `insert`
This inserts a record into a given table.
The keys of obj must be column names
and their values are the values to insert.

````
pg.insert('flavors', {name: 'vanilla', calories: 100})
  .then(result => {
    // Do something after successful insert.
    // result.rows[0] will be an object describing the inserted row.
  })
  .catch(err => {
    // Handle the error.
  });
````

## `query`
This executes a SQL query.
It is the most general purpose function provided.
It is used by several of the other functions.

````
pg.query('select name from flavors where calories < 150')
  .then(result => {
    // Do something with the result set in result.rows.
  })
  .catch(err => {
    // Handle the error.
  });

const sql = 'select name from flavors where calories < $1 and cost < $2';
pg.query(sql, [200, 3])
  .then(result => {
    // Do something with the result set in result.rows.
  })
  .catch(err => {
    // Handle the error.
  });
````

## `updateById`
This updates a record in a given table by id.
It requires the table to have a column named "id".

````
pg.updateById('flavors', 7, {name: 'chocolate', calories: 200})
  .then(result => {
    // Do something with the result set in result.rows.
    // result.rows[0] will be an object describing the updated row.
  })
  .catch(err => {
    // Handle the error.
  });
````
