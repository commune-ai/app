import { body } from 'express-validator';

export class ApiTransactionHistoryValidator {
    static createApiTransactionHistory() {
        return [
            body('endpoint')
                .notEmpty().withMessage('Endpoint is required')
                .isString().withMessage('Endpoint must be a string'),
            body('input')
                .notEmpty().withMessage('Input is required')
                .isObject().withMessage('Input must be a JSON object'),
            body('output')
                .notEmpty().withMessage('Output is required')
                .isObject().withMessage('Output must be a JSON object'),
            body('moduleId')
                .notEmpty().withMessage('Module ID is required')
                .isString().withMessage('Module ID must be a string')
        ];
    }
}