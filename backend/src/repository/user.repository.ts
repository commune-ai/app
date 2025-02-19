import { prisma } from "../model";

export class UserRepository {

    static async createUser(email: string, name: string, hash_password: string,profile_image_url?: string) {
        try {
            return await prisma.user.create({
                data: {
                    profile_image_url: profile_image_url,
                    email: email,
                    name: name,
                    password: hash_password
                }
            });
        } catch (e) {
            throw new Error("Database Error: User Creation Failed");
        }
    }

    static async findUserByEmail(email: string) {
        try{
            return await prisma.user.findUnique({
                where: {
                    email: email
                }
            });
        }catch(e){
            throw new Error("Database Error: User Finding Failed");
        }
    }
}