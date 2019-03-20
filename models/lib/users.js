const connection = require("../../database/connection");
const bcrypt = require('bcrypt');
const saltRounds = 10;


class User {
    static async addUser(firstName, lastName, email, phoneNumber, password) {
        let hashed = await bcrypt.hash(password, saltRounds);
        await connection.pool.query(`INSERT INTO users (first_name, last_name, email, phone_number, password) 
        VALUES ('${firstName}', '${lastName}', '${email}', '${phoneNumber}', '${hashed}')`)
    }

    static async checkUser(email, password) {
        let result = await connection.pool.query(`SELECT * FROM users WHERE email = '${email}'`);
        if (result.rows.length === 0) {
            return false
        }
        else {
            let res = await bcrypt.compare(password, result.rows[0].password)
               return res ? result.rows[0] : false
        }

    }

    static async getUsers(idArray) {
        let ids = idArray.join("','");
        let results = await connection.pool.query(`SELECT id, first_name, last_name FROM users WHERE id in (${ids}) `);
        return results.rows
    }
}

module.exports = User;