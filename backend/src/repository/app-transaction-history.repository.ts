import { prisma } from "../model";

export class AppTransactionHistoryRepository {

    static async createHistory(moduleworking: boolean, description: string, evidenceImage_url: string, modulename: string, userId: string) {
        try {
            return await prisma.appTransactionHistory.create({
                data: {
                    moduleworking: moduleworking,
                    description: description,
                    evidenceImage_url: evidenceImage_url,
                    modulename: modulename,
                    userId: userId
                }
            })

        } catch (e) {
            throw new Error("Database Error: AppHistory Creation Failed");
        }
    }

    static async getAppHistoryByModuleName(modulename: string) {
        try {
            return await prisma.appTransactionHistory.findMany({
                where: {
                    modulename: modulename
                }
            })
        } catch (e) {

        }
    }
}