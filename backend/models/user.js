const db = require('../util/database');

module.exports = class User {
  constructor(name, email, password) {
    this.name = name;
    this.email = email;
    this.password = password;
  }

    static find(email) {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
                if (err) {
                    reject(err);
                } 
                else {
                    resolve(row);
                }
            });
        });
    }

    static save(user) {
        return new Promise((resolve, reject) => {
            db.run(
                'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
                [user.name, user.email, user.password],
                (err) => {
                    if (err) {
                        reject(err);
                    } 
                    else {
                        resolve();
                    }
                }
            );
        });
    }
}