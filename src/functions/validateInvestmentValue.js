import 'dotenv/config';

function validateInvestmentValue(userContext) {
    if (Number(userContext.valorInvestimento) > Number(userContext.valorObjetivo)) {
        return {
            version: process.env.VERSION_SCREEN_API_FLOWS,
            screen: process.env.FINAL_SCREEN,
            data: {
                error_messages: {
                    valorInvestimento: process.env.VALIDATION_ERROR_MESSAGE_INVESTMENT_VALUE
                }
            },
        };
    }

    return null;
}

export default validateInvestmentValue;