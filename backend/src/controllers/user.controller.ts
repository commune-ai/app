import { UserRepository } from "../repository";
import { Request, Response, NextFunction } from "express";
import { JwtService, ResponseService, UserService } from "../services";
import { signatureVerify } from '@polkadot/util-crypto';
import { ethers } from 'ethers';
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
            let recoveredAddress: string;
            if (type === "metamask") {
                recoveredAddress = ethers.verifyMessage(user.nonce, signature);
                if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
                    return ResponseService.CreateErrorResponse("Invalid Signature", 400);
                }
            } else if (type === "subwallet") {
                const { isValid } = signatureVerify(user.nonce, signature, address);
                if (!isValid) {
                    return ResponseService.CreateErrorResponse("Invalid Signature", 400);
                }
            } else {
                return ResponseService.CreateErrorResponse("Invalid type", 400);
            }
            const token = await JwtService.sign(res, { userID: user.id }, process.env.JWT_SECRET as string, { expiresIn: "1d" });
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