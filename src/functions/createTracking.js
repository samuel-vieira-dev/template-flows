import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import 'dotenv/config';

async function createTracking(category, action, userId) {
    try {
        await axios.post(process.env.COMMANDS_URL, {
            id: uuidv4(),
            to: "postmaster@analytics.msging.net",
            method: "set",
            type: "application/vnd.iris.eventTrack+json",
            uri: process.env.COMMANDS_EVENT_TRACK_URI,
            resource: {
                category: category,
                action: action,
                contact: {
                    identity: `${userId}`
                }
            }
        }, {
            headers: {
                'Authorization': `${process.env.ROUTER_KEY}`,
                'Content-Type': 'application/json',
            }
        });
        console.log(`Tracking: ${category}, ${action}, ${userId}`);
    } catch (error) {
        console.error('Erro ao enviar tracking:', error);
    }
}

export default createTracking;
