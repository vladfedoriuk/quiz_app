const { check, validationResult } = require('express-validator');

const questionValidate = ()=>{
    return [
        check('points')
        .notEmpty().withMessage('must be not empty')
        .isNumeric().withMessage('must be a number'),
        check('correct_answer')
        .notEmpty().withMessage('must be not empty')
        .isIn([1, 2, 3, 4]).withMessage('must be 1...4'),
        check('question')
        .notEmpty().withMessage('must be not empty')
        .isLength({max: 200}).withMessage('must be no longer than 200'),
        check('answer_1')
        .notEmpty().withMessage('must be not empty')
        .isLength({max: 50}).withMessage('must be no longer than 50'),
        check('answer_2')
        .notEmpty().withMessage('must be not empty')
        .isLength({max: 50}).withMessage('must be no longer than 50'),
        check('answer_3')
        .isLength({max: 50}).withMessage('must be no longer than 50'),
        check('answer_4')
        .isLength({max: 50}).withMessage('must be no longer than 50'),
    ];
};

module.exports = questionValidate;