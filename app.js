const express = require('express');
const session = require('express-session');
const path = require('path');
const mainRouter = require('./routes/mainPages');
const quizRouter = require('./routes/quizPages');
const questionRouter = require('./routes/questionPages');

const app = express();

app.use(express.urlencoded({extended: false}));

//session configuration
app.use(session({
    secret: 'a secret key to be replaced',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60*1000*30
    }
}));

app.use(express.static(path.join(__dirname , 'static'))); //include static files.
app.set('views', path.join(__dirname, 'templates')); //include templates.
app.set('view engine', 'pug'); //define a template engine.

app.use('/question', questionRouter);
app.use('/quiz', quizRouter);
app.use('/', mainRouter);


//setting up the server
const port = 3808
app.listen(port, ()=> {
    console.log('Server is running on port ' + port);
});


module.exports = app;

// scp project3/app.js fedoriuk_1158649@spk-www.if.uj.edu.pl:/home.local/fedoriuk_1158649/twww2020 
// scp -r project3 fedoriuk_1158649@spk-www.if.uj.edu.pl:/home.local/fedoriuk_1158649/twww2020 
// ssh fedoriuk_1158649@spk-www.if.uj.edu.pl
// mysql -u fedoriuk_1158649 -p -D WWW20_FEDORIUK