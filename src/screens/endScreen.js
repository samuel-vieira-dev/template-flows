const endScreenData = (userContext) => {
    console.log(`endScreen: `, userContext);

    return {
        "version": "3.0",
        "screen": "SUCCESS",
        "data": {
            "extension_message_response": {
                "params": {
                    "flow_token": userContext.userId,
                    "state": `Western Australia`,
                }
            }
        }
    };
}

export default endScreenData;