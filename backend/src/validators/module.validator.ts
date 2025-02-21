import { body } from 'express-validator';

export class ModuleValidator {

    static createModule() {
        return [
            body('name')
                .notEmpty().withMessage('Module name is required')
                .isString().withMessage('Module name must be a string'),
            body('description')
                .notEmpty().withMessage('Description is required')
                .isString().withMessage('Description must be a string'),
            body('network')
                .notEmpty().withMessage('Network is required')
                .isString().withMessage('Network must be a string'),
            body('tags')
                .isArray().withMessage('Tags must be an array of strings'),
            body('key')
                .optional()
                .isString().withMessage('Key must be a string'),
            body('founder')
                .optional()
                .isString().withMessage('Founder must be a string'),
            body('hash')
                .optional()
                .isString().withMessage('Hash must be a string'),
            body('codelocation')
                .notEmpty().withMessage('Code location is required')
                .isString().withMessage('Code location must be a string'),
            body('appurl')
                .notEmpty().withMessage('App URL is required')
                .isString().withMessage('App URL must be a string'),
        ];
    }
}