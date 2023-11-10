const pool = require('../pool');
const toCamelCase = require('./utils/to-camel-case')

class UserRepo{
    static  async find(){
        const { rows } = await pool.query('select * from users;');

        return toCamelCase(rows);
    }

    static async findById(id){
        //warning : really big security issue!
        const {rows} = await pool.query(`
            select * from users where id = ${id};
        `);

        return toCamelCase(rows)[0];

    }

    static async insert(){

    }

    static async update(){

    }

    static async delete(){

    }

}
   
module.exports = UserRepo;