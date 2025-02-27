import { AppTransactionHistoryRepository, ModuleRepository, UserRepository } from "../repository";
import { Request, Response, NextFunction } from "express";
import { ResponseService, UserService } from "../services";
import lighthouse from '@lighthouse-web3/sdk'

const LIGHTHOUSE_API_KEY = process.env.LIGHTHOUSE_API_KEY as string;
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
                return ResponseService.CreateErrorResponse("Module does not exist", 400);
            }
            if (moduleExist.userId === userId) {
                return ResponseService.CreateErrorResponse("You cannot report on your own module", 400
                );
            }
            const verifySignature = await UserService.verifyWalletSignature(type, userExist.nonce, userExist.walletPublicKey, signature);
            if (!verifySignature) {
                return ResponseService.CreateErrorResponse("Invalid Signature/Type", 400);
            }
            const module_name = moduleExist.name;
            const walletPublicKey= userExist.walletPublicKey;
            const jsonData = { module_name, moduleworking, description, moduleid,walletPublicKey,signature }
            const lighthouseResponse = await lighthouse.uploadText(JSON.stringify(jsonData), LIGHTHOUSE_API_KEY);
            if (!lighthouseResponse || !lighthouseResponse.data || !lighthouseResponse.data.Hash) {
                return ResponseService.CreateErrorResponse("Adding to web3 storage failed", 400);
            }
            const ipfs_cid = lighthouseResponse.data.Hash;
            let moduleWork: boolean = moduleworking === "true" ? true : false;
            const appHistory = await AppTransactionHistoryRepository.createHistory(moduleWork, description, evidenceImage_url, moduleid, userId, ipfs_cid);
            return ResponseService.CreateSuccessResponse(appHistory, 200, res);
        } catch (e) {
            next(e);
        }
    }

    static async getHistoryOfModule(req: Request, res: Response, next: NextFunction) {
        try {
            const { moduleid } = req.params
            const moduleHistory = await AppTransactionHistoryRepository.getAppHistoryByModuleId(moduleid);
            return ResponseService.CreateSuccessResponse(moduleHistory, 200, res);
        } catch (e) {
            next(e);
        }
    }
}