import { body } from 'express-validator';

export class ModuleCodeValidator {
    static createModuleCode() {
        return [
            body('code')
                .notEmpty().withMessage('Code is required')
                .isObject().withMessage('Code must be a JSON object'),
            body('schema')
                .notEmpty().withMessage('Schema is required')
                .isObject().withMessage('Schema must be a JSON object'),
            body('moduleId')
                .notEmpty().withMessage('Module ID is required')
                .isString().withMessage('Module ID must be a string')
        ];
    }
}