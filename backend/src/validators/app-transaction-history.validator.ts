import { body } from 'express-validator';

export class AppTransactionHistoryValidator {
    static createAppTransactionHistory() {
        return [
            body("moduleworking")
                .isBoolean()
                .withMessage("moduleworking must be a boolean"),
            body("description")
                .isString()
                .notEmpty()
                .withMessage("moduleid is required"),
            body("moduleid")
                .isString()
                .notEmpty()
                .withMessage("moduleid is required"),
        ];
    }
}