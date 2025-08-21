import { body } from 'express-validator';

export const registerValidationRules = [
    body('name')
        .trim()
        .notEmpty().withMessage('name is required')
        .isLength({ min: 2 }).withMessage('name must be at least 2 characters'),

    body('email')
        .trim()
        .notEmpty().withMessage('email is required')
        .isEmail().withMessage('must be a valid email'),

    body('password')
        .notEmpty().withMessage('password is required')
        .isLength({ min: 8 }).withMessage('password must be at least 8 characters')
        .matches(/\d/).withMessage('password must contain a number')
        .matches(/[A-Z]/).withMessage('password must contain an uppercase letter'),

    body('confirmPassword')
        .notEmpty().withMessage('confirm Password is required')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('passwords do not match');
            }
            return true;
        }),
];

