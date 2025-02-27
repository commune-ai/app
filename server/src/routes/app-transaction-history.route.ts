import { Router } from "express";
import { AppTransactionHistoryController } from "../controllers";
import { GlobalMiddleware } from "../middleware";
import { AppTransactionHistoryValidator } from "../validators";
import { imageUpload } from "../services";
class AppTransactionHistoryRoute {
    public router: Router = Router();
    constructor() {
        this.getRoutes();
        this.postRoutes();
    }
    getRoutes() {
        this.router.get("/:moduleid", AppTransactionHistoryController.getHistoryOfModule);
    }
    postRoutes() {
        this.router.post("/create", imageUpload.single("image"), AppTransactionHistoryValidator.createAppTransactionHistory(), GlobalMiddleware.CheckValidationResult, GlobalMiddleware.CheckAuth, AppTransactionHistoryController.createAppHistory);
    }
}
export const AppTransactionHistoryRoutes = new AppTransactionHistoryRoute().router;