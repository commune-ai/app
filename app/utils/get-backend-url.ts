const getBackendUrl = async() => {
    const backendUrl =process.env.NEXT_PUBLIC_API_URL;

    if (!backendUrl) {
        throw new Error('Backend URL is not set');
    }

    return backendUrl;

}
export default getBackendUrl;