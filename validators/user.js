const { check, validationResult } = require('express-validator');

const userValidate = ()=>{
    return [
        check('username')
        .notEmpty().withMessage('must be not empty')
        .isLength({max: 30}).withMessage('must be no longer than 30 symbols'),
        check('password')
        .notEmpty().withMessage('must be not empty')
        .isLength({max: 200}).withMessage('must be no longer than 200 symbols')
    ];
};

const registerValidate = ()=>{
    return[
        check('reg_username')
        .notEmpty().withMessage('must be not empty')
        .isLength({max: 30}).withMessage('must be no longer than 30 symbols'),
        check('reg_password')
        .notEmpty().withMessage('must be not empty')
        .isLength({max: 200}).withMessage('must be no longer than 200 symbols'),
        check('reg_fullname')
        .notEmpty().withMessage('must be not empty')
        .isLength({max: 100}).withMessage('must be no longer than 100 symbols')
    ];
};


module.exports = {userValidate, registerValidate};