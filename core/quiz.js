const pool = require('./pool');

class Quiz{
    constructor(user_id, description, title){
        this.user_id = user_id;
        this.description = description;
        this.title = title;
    }

    save(){
        pool.query(
            'INSERT INTO Quiz (user_id, description, name) VALUES (?, ?, ?);', 
            [
               this.user_id,
               this.description,
               this.title
            ],
            (error, results, fields)=>{
                if(error) throw error;
            }
        );
    }

    static findForUser(user_id, callback=null){
        pool.query(
            'SELECT id, name, description FROM Quiz WHERE user_id = ?',
            [user_id],
            (error, results, fields)=>{
                if(error) throw error;
                if(callback){

                    var quizes = [];
                    results.forEach((item)=>{
                        quizes.push({
                            'id': item.id,
                            'title': item.name,
                            'description': item.description
                        })
                    })
                    console.log(quizes);
                    callback(quizes);
                }
            }
        );
    }

    static findForId(quiz_id, callback=null){
        pool.query(
            'SELECT name, description, user_id FROM Quiz WHERE id= ?',
            [quiz_id],
            (error, results, fields)=>{
                if(error) throw error;
                var data = {};
                if(callback){
                    if(results.length == 0){
                        data.message = 'There is no such quiz';
                        data.quiz = null;
                    } else{
                        data.message = 'OK';
                        var quiz = results[0];
                        data.quiz = {
                            'title': quiz.name,
                            'description': quiz.description,
                            'user_id': quiz.user_id
                        }
                    }
                callback(data);
                }
            }
        )
    }

    static update(quiz_id, description, title, callback){
        var params = {
            description: description,
            name: title
        };
        pool.query(
            'UPDATE Quiz SET ? WHERE id = ?',
            [
                params,
                quiz_id
            ],
            (error, results, fields)=>{
                if (error) throw error;
                if (callback){
                    callback();
                }
            }
        );
    }
    static delete(quiz_id, callback){
        pool.query(
            'DELETE FROM Quiz WHERE id = ?',
            [quiz_id],
            (error, results, fields) =>{
                if(error) throw error;
                if(callback){
                    callback();
                }
            }
        );
    }
}

/*
Quiz.findForUser(user_id=1,callback=(results)=>{
    console.log(results);
});
*/
/*
Quiz.findForId(quiz_id=5, (data)=>{
    console.log(data);
});
*/
/*Quiz.update(quiz_id=6, title='some other title', description='some other description');
Quiz.findForId(quiz_id=6, (data)=>{
    console.log(data);
});
*/

//Quiz.delete(quiz_id=7);

module.exports=Quiz;
