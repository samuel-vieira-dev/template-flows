import express from 'express';
import decryptRequest from '../crypto/decrypt.js';
import encryptResponse from '../crypto/encrypt.js';
import getScreenData from '../functions/flowLogic.js';
import healthCheck from '../functions/healthCheck.js';

const router = express.Router();

let userContexts = {};

router.post('/flow', async (req, res) => {
    console.log(`\nReceived encrypted data in /flow: ${JSON.stringify(req.body)}\n`);

    try {
        const { decryptedBody, aesKeyBuffer, initialVectorBuffer } = decryptRequest(req.body);
        console.log(`Received decrypted data in /flow: ${JSON.stringify(decryptedBody)}\n`);

        if (healthCheck(decryptedBody, aesKeyBuffer, initialVectorBuffer, res)) {
            return;
        }

        const userId = decryptedBody.flow_token.split('|')[0];

        const { next, ...incomingData } = decryptedBody.data;
        if (!userContexts[userId]) {
            userContexts[userId] = {};
        }
        userContexts[userId] = { ...userContexts[userId], ...incomingData, userId };

        const screenDataPromise = getScreenData(decryptedBody.data.next || decryptedBody.screen, userContexts[userId]);
        const screenData = await screenDataPromise;
        console.log(`Return decrypt: ${JSON.stringify(screenData)}\n`);

        const encryptedResponse = encryptResponse(screenData, aesKeyBuffer, initialVectorBuffer);
        console.log(`Return encrypt: ${JSON.stringify(encryptedResponse)}\n`);

        res.send(encryptedResponse);
    } catch (error) {
        console.error('Error in endpoint /flow:', error);
        res.status(500).send('An error ocurred. For more details see error log.');
    }
});


export default router;