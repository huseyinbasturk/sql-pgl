const {randomBytes} = require('crypto');
const {default: migrate} = require('node-pg-migrate');
const format = require('pg-format');
const pool = require('../pool');

const DEFAULT_OPTS = {
    host: 'localhost',
        port: 5432,
        database: 'socialnetwork-test',
        user: 'postgres',
        password: 'postgres'

}

class Context {

    static async build(){
         //randomly generating a role name to connect to pg as
    const roleName = 'a' + randomBytes(4).toString('hex');

    //connect to pg as usual
    await pool.connect(DEFAULT_OPTS);

    //creaete a new role
    await pool.query(format(
        'create role %I with login password %L;', roleName, roleName
    ));

    //create a schema with the same name
    await pool.query(format(
        'create schema %I authorization %I;', roleName, roleName
    ))

    //disconnect entirely from pg
    await pool.close();

    //run our migrations in the new schema
    await migrate({
        schema: roleName,
        direction: 'up',
        log: () => {},
        noLock: true,
        dir: 'migrations',
        databaseUrl: {
            host: 'localhost',
            port: 5432,
            database: 'socialnetwork-test',
            user: roleName,
            password: roleName
        }
    });

    //connect to pg as the newly created role
    await pool.connect({
        host: 'localhost',
        port: 5432,
        database: 'socialnetwork-test',
        user: roleName,
        password: roleName
        });

        return new Context(roleName);
    }

    constructor(roleName){
        this.roleName = roleName;
    }

    async reset(){
        return pool.query(`
        delete from users;`);
    }

    async close(){
        //disconnect from pg
        await pool.close();

        //reconnect as our root user
        await pool.connect(DEFAULT_OPTS);

        //delete the role and schema we created
        await pool.query(
            format('drop schema %I cascade;', this.roleName)
        )
        await pool.query(
            format('drop role %I;', this.roleName)
        )

        //disconnect
        await pool.close();
    }

}

module.exports = Context;