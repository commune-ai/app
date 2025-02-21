import { AppTransactionHistoryRepository, ModuleRepository, UserRepository } from "../repository";
import { Request, Response, NextFunction } from "express";
import { ResponseService } from "../services";
import { ethers } from "ethers";
import { signatureVerify } from "@polkadot/util-crypto";


export class AppTransactionHistoryController {

    static async createAppHistory(req: Request, res: Response, next: NextFunction) {
        try {
            const { moduleworking, description, moduleid, type, signature } = req.body;
            const userId = req.body.userID;
            const evidenceImage_url = req.file?.filename;
            const userExist = await UserRepository.findUserExistById(userId);
            const moduleExist = await ModuleRepository.findModuleById(moduleid);
            if (!userExist) {
                return ResponseService.CreateErrorResponse("User of given token does not exist,logout of the system and try again", 400);
            }
            if (!evidenceImage_url) {
                return ResponseService.CreateErrorResponse("Evidence Image file is required", 400);
            }
            if (!moduleExist) {
                return ResponseService.CreateErrorResponse("Module of given id not found for reporting", 400);
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
            const appHistory = await AppTransactionHistoryRepository.createHistory(moduleworking, description, evidenceImage_url, moduleid, userId);
            return ResponseService.CreateSuccessResponse(appHistory, 200, res);
        } catch (e) {
            next(e);
        }
    }

    static async getHistoryOfModule(req: Request, res: Response, next: NextFunction) {
        try {
            const { moduleid } = req.params
            const moduleExist = await ModuleRepository.findModuleById(moduleid);
            if (!moduleExist) {
                return ResponseService.CreateErrorResponse("Module of given id not found for reporting", 400);
            }
            const moduleHistory = await AppTransactionHistoryRepository.getAppHistoryByModuleId(moduleid);
            return ResponseService.CreateSuccessResponse(moduleHistory, 200, res);
        } catch (e) {
            next(e);
        }
    }
}