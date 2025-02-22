import { AppTransactionHistoryRepository, ModuleRepository, UserRepository } from "../repository";
import { Request, Response, NextFunction } from "express";
import { ResponseService } from "../services";
import { ethers } from "ethers";
import { signatureVerify } from "@polkadot/util-crypto";


export class AppTransactionHistoryController {

    static async createAppHistory(req: Request, res: Response, next: NextFunction) {
        try {
            const { moduleworking, description, modulename, type, signature } = req.body;
            const userId = req.body.userID;
            const evidenceImage_url = req.file?.filename;
            const userExist = await UserRepository.findUserExistById(userId);
            if (!userExist) {
                return ResponseService.CreateErrorResponse("User of given token does not exist,logout of the system and try again", 400);
            }
            if (!evidenceImage_url) {
                return ResponseService.CreateErrorResponse("Evidence Image file is required", 400);
            }
            let recoveredAddress: string;
            if (type === "metamask") {
                recoveredAddress = ethers.verifyMessage(userExist.nonce, signature);
                if (recoveredAddress.toLowerCase() !== userExist.walletPublicKey.toLowerCase()) {
                    return ResponseService.CreateErrorResponse("Invalid Signature", 400);
                }
            } else if (type === "subwallet") {
                const { isValid } = signatureVerify(userExist.nonce, signature, userExist.walletPublicKey);
                if (!isValid) {
                    return ResponseService.CreateErrorResponse("Invalid Signature", 400);
                }
            } else {
                return ResponseService.CreateErrorResponse("Invalid type", 400);
            }
            let moduleWork:boolean = moduleworking === "true" ? true : false;
            const appHistory = await AppTransactionHistoryRepository.createHistory(moduleWork, description, evidenceImage_url, modulename, userId);
            return ResponseService.CreateSuccessResponse(appHistory, 200, res);
        } catch (e) {
            next(e);
        }
    }

    static async getHistoryOfModule(req: Request, res: Response, next: NextFunction) {
        try {
            const { modulename } = req.params
            const moduleHistory = await AppTransactionHistoryRepository.getAppHistoryByModuleName(modulename);
            return ResponseService.CreateSuccessResponse(moduleHistory, 200, res);
        } catch (e) {
            next(e);
        }
    }
}