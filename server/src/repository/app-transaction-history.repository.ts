import { prisma } from "../model";

export class AppTransactionHistoryRepository {

    static async createHistory(moduleworking: boolean, description: string, evidenceImage_url: string, moduleid: string, userId: string, ipfs_cid: string) {
        try {
            return await prisma.appTransactionHistory.create({
                data: {
                    moduleworking: moduleworking,
                    description: description,
                    evidenceImage_url: evidenceImage_url,
                    ipfs_cid: ipfs_cid,
                    moduleId: moduleid,
                    userId: userId
                }
            })

        } catch (e) {
            throw new Error("Database Error: AppHistory Creation Failed");
        }
    }

    static async getAppHistoryByModuleId(moduleid: string) {
        try {
            return await prisma.appTransactionHistory.findMany({
                where: {
                    moduleId: moduleid
                }
            })
        } catch (e) {

        }
    }
}