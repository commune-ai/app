import { prisma } from "../model";

export class ModuleRepository {

    static async createModule(name: string, description: string, network: string, tags: string[], key: string, codelocation: string, appurl: string, userId: string, module_image_url?: string, founder?: string, hash?: string) {
        try {
            return await prisma.module.create({
                data: {
                    module_image_url: module_image_url,
                    name: name,
                    description: description,
                    network: network,
                    tags: tags,
                    key: key,
                    founder: founder,
                    hash: hash,
                    codelocation: codelocation,
                    appurl: appurl,
                    userId: userId
                }
            });
        } catch (e) {
            throw new Error("Database Error: Module Creation Failed");
        }

    }

    static async findModuleById(id: string) {
        try {
            return await prisma.module.findUnique({
                where: {
                    id: id
                }
            });
        } catch (e) {
            throw new Error("Database Error: Module Finding Failed");
        }
    }
    
}