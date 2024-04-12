import goalsTracking from "./goalsTracking.js";

function getTitleByIndex(index) {
    // Garante que index seja tratado como string de forma segura
    const indexAsString = index?.toString();
    const objective = goalsTracking.find(obj => obj.id === indexAsString);
    if (objective) {
        return objective.title;
    } else {
        // Se não encontrou, retorna index convertido para string ou uma string vazia se index for undefined
        return indexAsString || 'Índice indefinido';
    }
}


export default getTitleByIndex;