import { Router } from "express";
import { UserController } from "../controllers";
import { GlobalMiddleware } from "../middleware";
import { UserValidator } from "../validators";
class UserRoute {
    public router: Router = Router();
    constructor() {
        this.getRoutes();
        this.postRoutes();
    }
    getRoutes() {
        this.router.get("/nonce/:address", UserController.createUserNonce);
    }
    postRoutes() {
        this.router.post("/verify", UserValidator.verifyUser(), GlobalMiddleware.CheckValidationResult, UserController.verifyUser);
    }
}
export const UserRoutes = new UserRoute().router;