import { UserRepository } from "../repository";
import { Request, Response, NextFunction } from "express";
import { JwtService, ResponseService, UserService } from "../services";
import { ethers } from 'ethers';
export class UserController {

    static async createUserNonce(req: Request, res: Response, next: NextFunction) {
        try {
            const { address } = req.params;
            if (!ethers.isAddress(address)) {
                return ResponseService.CreateErrorResponse("Invalid address", 400);
            }
            const nonce = await UserService.generateNonce();
            const user = await UserRepository.createUpdateUser(address, nonce);
            return ResponseService.CreateSuccessResponse({ nonce: user.nonce }, 200, res);
        } catch (e) {
            next(e);
        }
    }

    static async verifyUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { address, signature } = req.body;
            if (!ethers.isAddress(address)) {
                return ResponseService.CreateErrorResponse("Invalid address", 400);
            }
            const user = await UserRepository.findUserByWalletAddress(address);
            if (!user) {
                return ResponseService.CreateErrorResponse("User not found", 404);
            }
            const recoveredAddress = ethers.verifyMessage(user.nonce, signature);
            if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
                return ResponseService.CreateErrorResponse("Invalid Signature", 400);
            }
            const token=await JwtService.sign(res, { userID: user.id }, process.env.JWT_SECRET as string, { expiresIn: "1d" });
            await UserRepository.resetNonce(address);
            return ResponseService.CreateSuccessResponse({ message: "Login Successful",token:token }, 200, res);
        } catch (e) {
            next(e);
        }
    }
}