import { prisma } from "../model";

export class ModuleRepository {

    static async createModule(name: string, description: string, network: string, tags: string[], codelocation: string, appurl: string, ipfs_cid: string, userId: string, module_image_url?: string, key?: string, founder?: string) {
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
                    codelocation: codelocation,
                    appurl: appurl,
                    ipfs_cid: ipfs_cid,
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

    static async findAllModules() {
        try {
            return await prisma.module.findMany();
        } catch (e) {
            throw new Error("Database Error: Module Finding Failed");
        }
    }

    static async findExistingModuleName(name: string) {
        try {
            return await prisma.module.findFirst({
                where: {
                    name: name
                }
            });
        } catch (e) {
            throw new Error("Database Error: Module Finding Failed");
        }
    }

    static async getUniqueNetworksAndTags() {
        try {
            return await prisma.module.findMany({
                select: {
                    network: true,
                    tags: true,
                },
            });
        } catch (e) {
            throw new Error("Database Error: Unique Network and Tags Finding Failed");
        }
    }

}