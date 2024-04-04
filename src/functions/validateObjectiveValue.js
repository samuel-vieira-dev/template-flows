import 'dotenv/config';

function validateObjectiveValue(userContext) {
    if (Number(userContext.valorObjetivo) <= process.env.MINIMUM_OBJECTIVE_VALUE) {
        return {
            version: process.env.VERSION_SCREEN_API_FLOWS,
            screen: process.env.FINAL_SCREEN,
            data: {
                error_messages: {
                    valorObjetivo: process.env.VALIDATION_ERROR_MESSAGE_OBJECTIVE_VALUE
                }
            },
        };
    }

    return null;
}

export default validateObjectiveValue;