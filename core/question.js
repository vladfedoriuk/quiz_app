const pool = require('./pool');

class Question{
    constructor(quiz_id, question, points, correct_answer, answers){
        this.quiz_id = quiz_id;
        this.points = points;
        this.correct_answer = correct_answer;
        this.answers = answers;
        this.question = question;
    }
    save(){
        pool.query(
            'INSERT INTO Question\
             (quiz_id, question, points, correct_answer, answer_1, answer_2, answer_3, answer_4)\
                VALUES\
                (?, ?, ?, ?, ?);',
                [
                    this.quiz_id,
                    this.question,
                    this.points,
                    this.correct_answer,
                    this.answers
                ],
                (error, results, fields)=>{
                    if(error) throw error;

                }
        );
    }

    static findForQuiz(quiz_id, callback=null){
        pool.query(
            'SELECT id, question, points, correct_answer, answer_1, answer_2, answer_3, answer_4\
                FROM Question WHERE quiz_id = ?;',
            [
                quiz_id
            ],
            (error, results, fields)=>{
                if(error) throw error;
                var data = {};
                if(callback){
                    if(results.length == 0){
                        data.message = 'There are no questions';
                        data.questions = null;
                    } else{
                        data.message = 'OK';
                        data.questions = results;
                    }
                    console.log(data);
                    callback(data);
                }
            }
        );
    }

    static update(question_id, question, points, correct_answer, answers, callback){
        var params = {
            question: question,
            points: points,
            correct_answer: correct_answer,
        };
        for(var i = 1; i<=answers.length; i++){
            if(answers[i-1]){
                params['answer_'+i] = answers[i-1];
            }
        }
        pool.query(
            'UPDATE Question SET ? WHERE id = ?',
            [
                params,
                question_id
            ],
            (error, results, fields)=>{
                if (error) throw error;
                if (callback){
                    callback();
                }
            }
        );
    }

    static findForId(question_id, columns, callback=null){
        pool.query(
            'SELECT ?? FROM Question WHERE id = ?',
            [
                columns,
                question_id,
            ],
            (error, results, fields)=>{
                if(error) throw error;
                if(callback){
                    var data = {};
                    if(results.lenfth != 0){
                        data.message="OK";
                        data.question=results[0];
                    }
                    else{
                        message="No such question";
                        data.question = null;
                    }
                    callback(data);
                }
            }
        );
    }
}
/*
var question = new Question(
    quiz_id=6, 
    question = 'a or b?',
    points=20,
    correct_answer=2,
    answers=['a', 'b', 'c', 'd'],
);

question.save();

Question.findForQuiz(quiz_id=6, (data)=>{
    console.log(data.questions);
});

*/
/*
Question.update(
    question_id=9,
    question="x or y?",
    points=100500,
    correct_answer=3,
    answers=['x', 'y']
);

Question.findForQuiz(quiz_id=6, (data)=>{
    console.log(data.questions);
});
*/

/*
Question.findForId(question_id=17, ['correct_answer', 'points'], (results)=>{
    console.log(results);
});
*/

module.exports = Question;