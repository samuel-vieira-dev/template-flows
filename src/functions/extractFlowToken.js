function extractFlowToken(flowToken) {
    const separator = flowToken.split('|');

    const userId = separator[0].trim();

    const postcodeMatch = separator[1].match(/\b(\d+)$/);
    const postcode = postcodeMatch ? postcodeMatch[1] : null;

    return { userId, postcode };
}

export default extractFlowToken;