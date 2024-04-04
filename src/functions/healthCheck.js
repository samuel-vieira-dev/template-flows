import encryptResponse from "../crypto/encrypt.js";
import 'dotenv/config';

const healthCheck = (decryptedBody, aesKeyBuffer, initialVectorBuffer, res) => {
    if (decryptedBody.action === 'ping') {
        const pingResponse = {
            version: process.env.VERSION_SCREEN_API_FLOWS,
            data: {
                status: "active"
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
