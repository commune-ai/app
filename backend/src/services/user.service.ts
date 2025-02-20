import bcrypt from 'bcrypt';
export class UserService {
    static async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, 10);
    }
    static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(password, hashedPassword);
    }
    static async generateNonce(): Promise<string> {
        return Math.random().toString(36).substring(2, 15);
    }
}