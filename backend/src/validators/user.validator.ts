import { body } from 'express-validator';

export class UserValidator {
    static updateUser() {
        return [
            body('name')
                .optional()
                .isString().withMessage('Name must be a string'),
        ];
    }

    static verifyUser() {
        return [
            body('address')
                .notEmpty().withMessage('address is required'),
            body('signature')
                .notEmpty().withMessage('Signature is required'),
            body('type')
                .notEmpty().withMessage('Type is required')
        ];
    }
}