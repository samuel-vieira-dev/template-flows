import createTracking from "../functions/createTracking.js";
import dynamicMessages from "../functions/dynamicMessages.js"
import getNextMonthTimestamp from "../functions/getNextMonthTimestamp.js";
import getTitleByIndex from "../functions/getTitleByIndex.js";
import 'dotenv/config';

const initScreenData = async (userContext) => {
  const mensagensDinamicas = dynamicMessages[userContext.primeiroPasso] || {
    mensagemInicial: process.env.OTHERS_INITIAL_MESSAGE,
    mensagemValorObjetivo: process.env.OTHER_GOAL_VALUE_MESSAGE,
    mensagemValorInvestimento: process.env.OTHER_INVESTMENT_VALUE_MESSAGE,
    mensagemDataObjetivo: process.env.OTHER_GOAL_DATE_MESSAGE,
  };

  if (userContext.primeiroPasso == 8) {
    return {
      version: process.env.VERSION_SCREEN_API_FLOWS,
      screen: process.env.INICIAL_SCREEN,
      data: {
        nomeObjetivoVisible: true,
        proximoMes: getNextMonthTimestamp()
      },
    };
  }

  createTracking(process.env.CATEGORY_FIRST_SCREEN, getTitleByIndex(userContext.primeiroPasso), userContext.userId);

  return {
    version: process.env.VERSION_SCREEN_API_FLOWS,
    screen: process.env.INICIAL_SCREEN,
    data: {
      nomeObjetivoVisible: false,
      proximoMes: getNextMonthTimestamp(),
      ...mensagensDinamicas
    },
  };
};

export default initScreenData;
