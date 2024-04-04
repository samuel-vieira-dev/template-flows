import initScreenData from '../screens/initScreenData.js';
import endScreenData from '../screens/endScreen.js';
import 'dotenv/config';

const getScreenData = (screenName, userContext) => {
    switch (screenName) {
        case process.env.INICIAL_SCREEN:
            return initScreenData(userContext);
            
        case process.env.FINAL_SCREEN:
            return endScreenData(userContext);

        default:
            throw new Error('Screen not found');
    }
};

export default getScreenData;