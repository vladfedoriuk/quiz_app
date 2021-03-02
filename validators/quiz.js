const { check, validationResult } = require('express-validator');

const quizValidate = ()=>{
    return [
        check('title')
        .notEmpty().withMessage('must be not empty')
        .isLength({max: 30}).withMessage('must be no longer than 30 symbols'),
        check('description')
        .notEmpty().withMessage('must be not empty')
        .isLength({max: 100}).withMessage('must be no longer than 100 symbols')
    ];
};

module.exports = quizValidate;