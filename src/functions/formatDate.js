function formatDate(dataObjetivo) {
    const timestamp = Number(dataObjetivo);
    const data = new Date(timestamp);
    
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    
    return `${dia}/${mes}/${ano}`;
}

export default formatDate;