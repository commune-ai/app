import { prisma } from "../model";

export class UserRepository {

    static async createUpdateUser(address: string, nonce: string) {
        try {

            return await prisma.user.upsert({
                where: {
                    walletPublicKey: address
                },
                update: {
                    nonce: nonce
                },
                create: {
                    walletPublicKey: address,
                    nonce: nonce
                }
            });

        } catch (e) {
            throw new Error("Database Error: User Update/Creation Failed");
        }
    }

    static async resetNonce(address: string) {
        try {
            return await prisma.user.update({
                where: {
                    walletPublicKey: address
                },
                data: {
                    nonce: ""
                }
            });
        } catch (e) {
            throw new Error("Database Error: User Update Failed");
        }
    }

    static async findUserByWalletAddress(address: string) {
        try {
            return await prisma.user.findUnique({
                where: {
                    walletPublicKey: address
                }
            });
        } catch (e) {
            throw new Error("Database Error: User Finding Failed");
        }
    }

    static async updateUserNameorImage(address: string, name?: string, image?: string) {
        try {
            return await prisma.user.update({
                where: {
                    walletPublicKey: address
                },
                data: {
                    name: name,
                    profile_image_url: image
                }
            });
        } catch (e) {
            throw new Error("Database Error: User Update Failed");
        }
    }
}