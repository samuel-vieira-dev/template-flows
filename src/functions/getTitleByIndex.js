import goalsTracking from "./goalsTracking.js";

function getTitleByIndex(index) {
    const objective = goalsTracking.find(obj => obj.id === index.toString());
    if (objective) {
        return objective.title;
    } else {
        return index;
    }
}

export default getTitleByIndex;