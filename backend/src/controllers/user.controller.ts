import { UserRepository } from "../repository";
import { Request, Response, NextFunction } from "express";
import { JwtService, ResponseService, UserService } from "../services";
export class UserController {

    static async createUser(req: Request, res: Response, next: NextFunction) {
        try {
            const {email,name,password} = req.body;
            let profile_image_url = req.file?.filename;
            const checkUser= await UserRepository.findUserByEmail(email);
            if(checkUser){
                return ResponseService.CreateErrorResponse("User already exists", 400);
            }
            const hash_password = await UserService.hashPassword(password);
            const newUser = await UserRepository.createUser(email,name,hash_password,profile_image_url);
            return ResponseService.CreateSuccessResponse(newUser, 200, res);
        } catch (e) {
            next(e);
        }
    }

    static async loginUser(req: Request, res: Response, next: NextFunction) {
        try {
            const {email,password} = req.body;
            const user = await UserRepository.findUserByEmail(email);
            if(!user){
                return ResponseService.CreateErrorResponse("User not found", 404);
            }
            const isPasswordMatch = await UserService.comparePassword(password,user.password);
            if(!isPasswordMatch){
                return ResponseService.CreateErrorResponse("Invalid password", 400);
            }
            await JwtService.sign(res,{userID:user.id},process.env.JWT_SECRET as string, {expiresIn: "1d"});
            return ResponseService.CreateSuccessResponse(user, 200, res);
        } catch (e) {
            next(e);
        }
    }
}