const pg = require('pg');

const pool = new pg.Pool({
  host: 'localhost',
  port: 5432,
  database: 'socialnetwork',
  user: 'postgres',
  password: 'postgres',
});

pool.query(`
    update posts
    set loc = point(lng, lat)
    where loc is null;
`)
    .then(()=> {
        console.log('Update complete');
        pool.end();
    })
    .catch((err)=> console.log(err));