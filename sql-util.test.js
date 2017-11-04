const SqlUtil = require('./sql-util');

describe('sql', () => {
  const tableName = 'test_table';
  let sqlUtil;

  beforeEach(() => {
    const pool = {
      end() {}
    };
    sqlUtil = new SqlUtil(pool, false);
  });

  test('constructor', () => {
    expect(typeof sqlUtil.pool).toBe('object');
    expect(Object.keys(sqlUtil.pool)).toEqual(['end']);
    expect(sqlUtil.debug).toBe(false);
  });

  test('deleteAll', () => {
    const expected = `delete from ${tableName}`;
    expect(sqlUtil.deleteAll(tableName)).toBe(expected);
  });

  test('deleteById', () => {
    const expected = `delete from ${tableName} where id=$1`;
    expect(sqlUtil.deleteById(tableName, 7)).toBe(expected);
  });

  test('disconnect', () => {
    sqlUtil.disconnect();
    expect(sqlUtil.pool).toBeNull();
  });

  test('getAll', () => {
    const expected = `select * from ${tableName}`;
    expect(sqlUtil.getAll(tableName)).toBe(expected);
  });

  test('getById', () => {
    const expected = `select * from ${tableName} where id=$1`;
    expect(sqlUtil.getById(tableName, 7)).toBe(expected);
  });

  test('insert', () => {
    const obj = {foo: true, bar: 7, baz: 'qux'};
    const expected =
      `insert into ${tableName} (foo, bar, baz) ` +
      'values($1, $2, $3) returning id';
    expect(sqlUtil.insert(tableName, obj)).toBe(expected);
  });
});
