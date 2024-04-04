function getNextMonthTimestamp() {
    var dataAtual = new Date();
    dataAtual.setDate(dataAtual.getDate() + 30);
    var timestampString = dataAtual.getTime().toString();

    return timestampString;
}

export default getNextMonthTimestamp;