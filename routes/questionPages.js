const { request, response } = require('express');
const express = require('express');
const session = require('express-session');
const { render } = require('pug');
const router = express.Router();
const User = require('../core/user');
const Quiz = require('../core/quiz');
const Question = require('../core/question');
const { check, validationResult } = require('express-validator');
const questionValidate = require('../validators/question');


router.put('/:question_id', questionValidate(), (request, response, next)=>{

    if(!request.session.data){  
        response.redirect('/');
        return;
    }

    Question.findForId(request.params.question_id, ['quiz_id'], (question_data)=>{
        if(question_data.message=='OK'){
            Quiz.findForId(question_data.question.quiz_id, (quiz_data)=>{
                if(quiz_data.message == 'OK'){
                    if(quiz_data.quiz.user_id != request.session.data.user_id){
                        response.sendStatus(404); 
                    }
                } else
                    response.sendStatus(404);
            });
        }
    });

    const errors = validationResult(request);

    if (errors.isEmpty()) {
        Question.update(
            question_id=request.params.question_id,
            question=request.body.question,
            points=request.body.points,
            correct_answer=request.body.correct_answer,
            answers=[
                request.body.answer_1,
                request.body.answer_2,
                request.body.answer_3,
                request.body.answer_4
            ]
        );
        response.sendStatus(200);
    } else{
        response.sendStatus(404);
    }
});

router.post('/:question_id', (request, response, next)=>{
    Question.findForId(
        question_id=request.params.question_id, 
        ['points', 'correct_answer'], (data)=>{
            if(data.message=='OK'){
                if(request.body.answer == data.question.correct_answer){
                    response.json({
                        'comment': 'OK',
                        'points': data.question.points
                    });
                } else{
                    response.json({
                        'comment': 'WRONG',
                        'points': data.question.points
                    });
                }
            } else{
                response.send(data.message);
            }
    });
});

router.post('/create/:quiz_id', questionValidate(), (request, response, next)=>{

    if(!request.session.data){  
        response.redirect('/');
        return;
    }

    Quiz.findForId(request.params.quiz_id, (result)=>{
        if(result.message == 'OK'){
            if(result.quiz.user_id != request.session.data.user_id){
                response.sendStatus(404); 
            }
        } else
            response.sendStatus(404);
    });

    const errors = validationResult(request);

    if (!errors.isEmpty()) {
        response.render(
            'question-create',
            {
                'quiz_id': request.params.quiz_id,
                'question_errors': errors.array(),
                 title: 'Create a queston'
            }
        );
        return;
    }

    Quiz.findForId(quiz_id=request.params.quiz_id, (data)=>{
        if(data.message == 'OK'){
            var question = new Question(
                quiz_id = request.params.quiz_id,
                question = request.body.question,
                points = request.body.points,
                correct_answer = request.body.correct_answer,
                answers = [
                    request.body.answer_1,
                    request.body.answer_2,
                    request.body.answer_3,
                    request.body.answer_4
                ]
            );
            question.save(); /// !!! FIXME - ADD VALIDATION
            response.redirect('../../quiz/edit/'+request.params.quiz_id);
        }
    });
});

router.post('/add/:quiz_id', (request, response, next)=>{

    if(!request.session.data){  
        response.redirect('/');
        return;
    }

    Quiz.findForId(request.params.quiz_id, (result)=>{
        if(result.message == 'OK'){
            if(result.quiz.user_id != request.session.data.user_id){
                response.sendStatus(404); 
            }
        } else
            response.sendStatus(404);
    });

    response.redirect(
        '../create/'+request.params.quiz_id
    );
});

router.get('/create/:quiz_id', (request, response, next)=>{
    if(!request.session.data){  
        response.redirect('/');
        return;
    }

    Quiz.findForId(request.params.quiz_id, (result)=>{
        if(result.message == 'OK'){
            if(result.quiz.user_id != request.session.data.user_id){
                response.sendStatus(404); 
            }
        } else
            response.sendStatus(404);
    });

    response.render(
        'question-create',
        {
            'quiz_id': request.params.quiz_id,
             title: 'Create a queston'
        }
    );
    return;
});

module.exports = router;