import { Router } from "express";
import { ModuleController } from "../controllers";
import { GlobalMiddleware } from "../middleware";
import { ModuleValidator } from "../validators";
import { imageUpload } from "../services";
class ModuleRoute {
    public router: Router = Router();
    constructor() {
        this.getRoutes();
        this.postRoutes();
    }
    getRoutes() {
        this.router.get("/", ModuleController.getModules);
        this.router.get("/:id", ModuleController.getModuleById);
    }
    postRoutes() {
        this.router.post("/create", imageUpload.single("image"), ModuleValidator.createModule(), GlobalMiddleware.CheckValidationResult, GlobalMiddleware.CheckAuth, ModuleController.createModule);
    }
}
export const ModuleRoutes = new ModuleRoute().router;