const pool = require('./pool');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

class User{
    constructor(username, fullname, password){
        this.username = username;
        this.fullname = fullname;
        this.password = password;
    }

    save(callback=null){
        pool.query(
            'INSERT INTO User (username, full_name, password) VALUES (?, ?, ?);', 
            [
               this.username,
               this.fullname,
               bcrypt.hashSync(this.password, salt)
            ],
            (error, results, fields)=>{
                if(error) throw error;
                callback();
            }
        );
    }

    static filter(params, callback=null){
        var sql = 'SELECT * FROM User WHERE ';
        var args = [params.id, params.username, params.fullname].filter(Boolean);
        var sqlArgs = [];
        if(params.hasOwnProperty('id')){
            sqlArgs.push('id=?')
        }
        if(params.hasOwnProperty('username')){
            sqlArgs.push('username=?');
        }
        if(params.hasOwnProperty('fullname')){
            sqlArgs.push('full_name=?');
        }
        sqlArgs = sqlArgs.join(' AND ');
        sql += sqlArgs;
        pool.query(sql, args, (error, results, fields)=>{
            if(error) throw error;
            if(callback){
                return callback(results);
            }
        });
    }

    static login(username, password, callback){
        User.filter({
            username: username
        },(results)=>{
            var data = {};
            console.log(results);
            if(results.length != 0){
                var userData=results[0];
                if(bcrypt.compareSync(password, userData.password)){
                    data = {
                        message: 'OK',
                        data:{
                            username: userData.username,
                            fullname: userData.full_name,
                            user_id: userData.id,
                        }
                    }
                } else{
                    data ={
                        message: 'Wrong password',
                        data: null
                    }                
                }
            } else{
                data = {
                    message: 'No such user',
                    data: null
                }
            } 
            callback(data);
        }); 
    }
}

//let user = new User('test', 'test account', 'pass4test');
//user.save();
/*
User.filter({
    username: 'test'
},(result)=>{
    results = result;
    console.log(results);
});

User.login('test', 'pass4test', (data)=>{
    console.log(data);
})
*/

module.exports=User;