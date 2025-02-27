import { body } from 'express-validator';

export class AppTransactionHistoryValidator {
    static createAppTransactionHistory() {
        return [
            body("moduleworking")
                .isBoolean()
                .withMessage("Moduleworking must be a boolean"),
            body("description")
                .isString()
                .notEmpty()
                .withMessage("Description is required"),
            body("moduleid")
                .isString()
                .notEmpty()
                .withMessage("Moduleid is required"),
            body('signature')
                .notEmpty().withMessage('Signature is required'),
            body('type')
                .notEmpty().withMessage('Type is required')
        ];
    }
}