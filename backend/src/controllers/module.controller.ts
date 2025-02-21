import { ModuleRepository, UserRepository } from "../repository";
import { Request, Response, NextFunction } from "express";
import { ResponseService } from "../services";
import lighthouse from '@lighthouse-web3/sdk'

const LIGHTHOUSE_API_KEY = process.env.LIGHTHOUSE_API_KEY as string;
export class ModuleController {

    static async createModule(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, description, network, tags, codelocation, appurl, key, founder, hash } = req.body;
            const userId = req.body.userID;
            const module_image_url = req.file?.filename;
            const userExist = await UserRepository.findUserExistById(userId);
            if (!userExist) {
                return ResponseService.CreateErrorResponse("User of given token does not exist,logout of the system and try again", 400);
            }
            const walletAddress = userExist.walletPublicKey;
            const existingModule = await ModuleRepository.findExistingModuleName(name);
            if (existingModule) {
                return ResponseService.CreateErrorResponse("Module name already exists", 400);
            }
            const jsonData = { name, description, network, tags, codelocation, appurl, key, walletAddress, founder, hash }
            const lighthouseResponse = await lighthouse.uploadText(JSON.stringify(jsonData), LIGHTHOUSE_API_KEY);
            if (!lighthouseResponse || !lighthouseResponse.data || !lighthouseResponse.data.Hash) {
                return ResponseService.CreateErrorResponse("Adding to web3 storage failed", 400);
            }
            const ipfs_cid = lighthouseResponse.data.Hash;
            const module = await ModuleRepository.createModule(name, description, network, tags, codelocation, appurl, ipfs_cid, userId, module_image_url, key, founder, hash);
            return ResponseService.CreateSuccessResponse(module, 200, res);
        } catch (e) {
            next(e);
        }
    }

    static async getModules(req: Request, res: Response, next: NextFunction) {
        try {
            const module = await ModuleRepository.findAllModules();
            return ResponseService.CreateSuccessResponse(module, 200, res);
        } catch (e) {
            next(e);
        }
    }
}