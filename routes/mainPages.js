const express = require('express');
const { check, validationResult } = require('express-validator');
const User = require('../core/user');
const Quiz = require('../core/quiz');
const { request, response } = require('express');
const router = express.Router();
const {userValidate, registerValidate} = require('../validators/user')


//get index page
router.get('/', (request, response, next) =>{
    data = request.session.data;
    if(data){
        response.redirect('/home');
        return;
    }
    response.render('index', {
        title: "Quizee"
    });
    return;
});


//get home page
router.get('/home', (request, response, next)=>{
    var data = request.session.data;
    if(data){
        Quiz.findForUser(user_id=data.user_id, (quizes)=>{
            response.render('home', {
                'new_user': request.session.new,
                'data': request.session.data,
                'quizes': quizes,
                 title: "Quizee"
    
            });
            return;
        });
    } else{
        response.redirect('/');
        return;
    }
});

//post login data
router.post('/login', userValidate(),
(request, response, next)=>{
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
        response.render('index', {
            title: "Quizee",
            log_errors: errors.array()
        });
        return;
    }
    User.login(request.body.username, request.body.password, (data)=>{
        if(data.message == 'OK'){  
            request.session.data = data.data;
            request.session.new = false;

            response.redirect('/home');
            return;

        } else {
            response.render('index', {
                title: "Quizee",
                validation_message: data.message
            });
            return;
        }
    });
});

router.post('/logout', (request, response, next)=>{
    request.session.data = null;
    request.session.new = null;
    response.redirect('/');
    return;
});


//post registration data
router.post('/register' , registerValidate(), (request, response, next)=>{
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        response.render('index', {
            title: "Quizee",
            reg_errors: errors.array()
        });
        return;
    }  else
     if(request.body['reg_password'] != request.body['conf-password']){
        var custom_errs = [];
        custom_errs.push({
            'param': 'conf-password',
            'msg': 'passwords don\'t match'
        });
        response.render('index', {
            title: "Quizee",
            reg_errors: custom_errs
        });
        return;
    } else
        User.filter({username: request.body.reg_username}, (result)=>{
            var custom_errs = [];
            if(result.length != 0){
                custom_errs.push({
                    'param': 'reg_username',
                    'msg': 'such a username already exists'
                });
                response.render('index', {
                    title: "Quizee",
                    reg_errors: custom_errs
                });
                return;
            } else{
                var user = new User(
                    request.body.reg_username, 
                    request.body.reg_fullname, 
                    request.body.reg_password
                );
                user.save(()=>{
                    User.login(request.body.reg_username, request.body.reg_password, (data)=>{
                        if(data.message == 'OK'){
                            request.session.data = data.data;
                            request.session.new = true;
                        }
                        response.redirect('/home');
                        return;
                    });
                });
            }
        });
});

//handle non-existing pages
router.use((request, response, next)=>{
    error = new Error("Page was not found");
    error.status = 404;
    next(error);
});

//handling internal errors as well as http-related
router.use((err, request, response, next)=>{
    response.status(err.status || 500);
    response.send(err.message); // FIXME!!! should be redirect to a special 404(or 500)-dedicated page.
})
module.exports = router;