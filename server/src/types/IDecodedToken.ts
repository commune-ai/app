import { JwtPayload } from "jsonwebtoken";

export interface IDecodedToken extends JwtPayload{
    userID:string;
}

export interface IDecodedDAOToken extends JwtPayload{
    doaID:string;
}