import getShowAddressScreenData from '../screens/showAddress.js';
import endScreenData from '../screens/endScreen.js';

const getScreenData = (screenName, userContext) => {
    switch (screenName) {
        case 'SHOW_ADDRESS':
            return getShowAddressScreenData(userContext);
            
        case 'SUCCESS':
            return endScreenData(userContext);

        default:
            throw new Error('Screen not found');
    }
};

export default getScreenData;

