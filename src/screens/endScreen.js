import createTracking from "../functions/createTracking.js";
import formatDate from "../functions/formatDate.js";
import validateObjectiveValue from "../functions/validateObjectiveValue.js";
import validateInvestmentValue from "../functions/validateInvestmentValue.js";
import 'dotenv/config';

const addErrorMessages = (errorMessages, newErrors) => {
    return { ...errorMessages, ...newErrors.data.error_messages };
};

const endScreenData = ({ acao, nomeObjetivo, valorObjetivo, valorInvestimento, dataObjetivo, userId, primeiroPasso, mensagemInicial, mensagemValorObjetivo, mensagemValorInvestimento, mensagemDataObjetivo, proximoMes }) => {
    const VERSION = process.env.VERSION_SCREEN_API_FLOWS;
    const FINAL_SCREEN = process.env.FINAL_SCREEN;
    const SUCCESS_SCREEN = process.env.SUCCESS_SCREEN;
    const CATEGORY_FINAL_SCREEN = process.env.CATEGORY_FINAL_SCREEN;

    if (acao === process.env.WELJ_PAYLOAD_ACTION_VALUE) {
        let errorMessages = {};

        const erroValorObjetivo = validateObjectiveValue({ nomeObjetivo, valorObjetivo, valorInvestimento, dataObjetivo });
        if (erroValorObjetivo) {
            errorMessages = addErrorMessages(errorMessages, erroValorObjetivo);
        }

        const erroValorInvestimento = validateInvestmentValue({ nomeObjetivo, valorObjetivo, valorInvestimento, dataObjetivo });
        if (erroValorInvestimento) {
            errorMessages = addErrorMessages(errorMessages, erroValorInvestimento);
        }

        if (Object.keys(errorMessages).length > 0) {
            return {
                version: VERSION,
                screen: FINAL_SCREEN,
                data: { error_messages: errorMessages },
            };
        }

        const trackingData = { nomeObjetivo, valorObjetivo, valorInvestimento, dataObjetivo: formatDate(dataObjetivo) };
        createTracking(CATEGORY_FINAL_SCREEN, JSON.stringify(trackingData), userId);

        return {
            version: VERSION,
            screen: SUCCESS_SCREEN,
            data: {
                extension_message_response: {
                    params: { primeiroPasso, nomeObjetivo, valorObjetivo, valorInvestimento, dataObjetivo },
                },
            },
        };
    }

    return {
        version: VERSION,
        screen: FINAL_SCREEN,
        data: { primeiroPasso, nomeObjetivo, mensagemInicial, mensagemValorObjetivo, mensagemValorInvestimento, mensagemDataObjetivo, proximoMes },
    };
}

export default endScreenData;
