const { request, response } = require('express');
const express = require('express');
const session = require('express-session');
const { check, validationResult } = require('express-validator');
const { render } = require('pug');
const router = express.Router();
const User = require('../core/user');
const Quiz = require('../core/quiz');
const Question = require('../core/question');
const quizValidate = require('../validators/quiz');



router.post('/delete/:quiz_id', (request, response, next)=>{ /// MAYBE ADD SOME CONFIRMATION IN THE TEMPLATE
    Quiz.findForId(request.params.quiz_id, (result)=>{
        if(result.message == 'OK'){
            if(result.quiz.user_id == request.session.data.user_id){
                Quiz.delete(quiz_id=request.params.quiz_id); 
                response.redirect('/home');
            } else
                response.sendStatus(404); 
        }
        else
            response.sendStatus(404);
    });
});

router.put('/:quiz_id', (request, response, next)=>{
    Quiz.findForId(request.params.quiz_id, (result)=>{
        if(result.message == 'OK'){
            if(result.quiz.user_id == request.session.data.user_id){
                Quiz.update(
                    quiz_id=request.params.quiz_id,
                    description=request.body.description,
                    title=request.body.title,
                );
                response.sendStatus(200);
            } else
                response.sendStatus(404); 
        }
        else
            response.sendStatus(404);
    });
});

router.get('/edit/:quiz_id', (request, response, next)=>{

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

    Quiz.findForId(quiz_id=request.params.quiz_id, (quiz_data)=>{
        if(quiz_data.message == 'OK'){
            Question.findForQuiz(quiz_id=request.params.quiz_id, (questions_data)=>{
                response.render(
                    'quiz-edit', 
                    {
                        'quiz': quiz_data.quiz,
                        'quiz_id': request.params.quiz_id,
                        'questions': questions_data.questions,
                        'data': request.session.data,
                        title: quiz_data.quiz.title
                    }
                );
                return;
            });
        } else{
            response.send(data.message); // FIXME : SHOULD BE REDIRECT TO A 404-DEDICATED PAGE
        }
    });
});

router.post('/add', (request, response, next)=>{
    if(!request.session.data){
        response.redirect('/');
        return;
    }
   response.redirect('./create');
});

router.get('/create', (request, response, next)=>{
    if(!request.session.data){
        response.redirect('/');
        return;
    }
    response.render(
        'quiz-create',
        {
            'title': 'create a quiz',
            'user_id': request.session.data.user_id,
            'data': request.session.data
        }
    );
    return;
});

router.post('/create', quizValidate(), (request, response, next)=>{
    if(!request.session.data){ 
        response.redirect('/');
        return;
    }
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
        response.render(
            'quiz-create',
            {
                'title': 'create a quiz',
                'user_id': request.session.data.user_id,
                'quiz_errors': errors.array()
            }
        );
        return;
    }

    var quiz = new Quiz(
        user_id=request.session.data.user_id, 
        description=request.body.description, 
        title=request.body.title
    );
    quiz.save();
    response.redirect('/home');
});

router.get('/:quiz_id', (request, response, next)=>{
    Quiz.findForId(quiz_id=request.params.quiz_id, (data)=>{
        if(data.message == 'OK'){
            Question.findForQuiz(quiz_id=request.params.quiz_id, (questions_data)=>{
                if(questions_data.message == 'OK'){
                    response.render(
                        'quiz', 
                        {
                            'quiz': data.quiz,
                            'data': request.session.data,
                            'questions': questions_data.questions,
                            title: data.quiz.title

                        }
                    );
                    return;
                } else if(questions_data.message == 'There are no questions'){
                    response.render(
                        'quiz', 
                        {
                            'quiz': data.quiz,
                            'data': request.session.data,
                            title: data.quiz.title

                        }
                    );
                    return;
                }
            });
         } else{
            response.send(data.message); // FIXME : SHOULD BE REDIRECT TO A 404-DEDICATED PAGE
        }
    });
});


module.exports = router;