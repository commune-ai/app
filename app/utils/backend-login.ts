import axios from 'axios';
import getBackendUrl from "./get-backend-url";
const apiBase = await getBackendUrl();
export const fetchNonce = async (address: string) => {
    const response = await axios.get(`${apiBase}/api/auth/nonce/${address}`);
    return response.data.nonce;
};

export const verifySignature = async (address: string, signature: string, type: string): Promise<{ success: boolean, error?: string }> => {
    try {
        await axios.post(`${apiBase}/api/auth/verify`, {
            address,
            signature,
            type
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true
        });
        return { success: true };
    } catch (error) {
        return { success: false, error: "failed to get value" };
    }
};

export const logout = async () => {
    try {
        await axios.get(`${apiBase}/api/auth/logout`, {
            withCredentials: true
        });
    } catch (error) {
        console.error(error);
    }
}