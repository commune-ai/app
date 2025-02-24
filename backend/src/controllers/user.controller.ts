import { UserRepository } from "../repository";
import { Request, Response, NextFunction } from "express";
import { JwtService, ResponseService, UserService } from "../services";

const JWT_SECRET = process.env.JWT_SECRET as string
export class UserController {

    static async createUserNonce(req: Request, res: Response, next: NextFunction) {
        try {
            const { address } = req.params;
            const nonce = await UserService.generateNonce();
            const user = await UserRepository.createUpdateUser(address, nonce);
            return ResponseService.CreateSuccessResponse({ nonce: user.nonce }, 200, res);
        } catch (e) {
            next(e);
        }
    }

    static async verifyUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { address, signature, type } = req.body;
            const user = await UserRepository.findUserByWalletAddress(address);
            if (!user) {
                return ResponseService.CreateErrorResponse("User not found", 404);
            }
            const isVerified=await UserService.verifyWalletSignature(type, user.nonce, address, signature);
            if (!isVerified) {
                return ResponseService.CreateErrorResponse("Invalid Signature/Type", 400);
            }
            const token = await JwtService.sign(res, { userID: user.id }, JWT_SECRET, { expiresIn: "1d" });
            await UserRepository.resetNonce(address);
            return ResponseService.CreateSuccessResponse({ message: "Login Successful", token: token }, 200, res);
        } catch (e) {
            next(e);
        }
    }

    static async logout(req: Request, res: Response, next: NextFunction) {
        try {
            res.clearCookie("token");
            return ResponseService.CreateSuccessResponse("Logout", 200, res);
        } catch (e) {
            next(e);
        }
    }
}