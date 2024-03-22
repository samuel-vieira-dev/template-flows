import encryptResponse from "../crypto/encrypt.js";

const healthCheck = (decryptedBody, aesKeyBuffer, initialVectorBuffer, res) => {
    if (decryptedBody.action === 'ping') {
        const pingResponse = {
            "version": "3.0",
            "data": {
                "status": "active"
            }
        };
        const encryptedResponse = encryptResponse(pingResponse, aesKeyBuffer, initialVectorBuffer);
        console.log(`Return encrypt (ping): ${JSON.stringify(encryptedResponse)}\n`);
        res.send(encryptedResponse);
        return true;
    }

    return false;
};

export default healthCheck;
