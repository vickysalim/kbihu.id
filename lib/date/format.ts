const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
}

const formatDateInput = (timestamp: string) => {
    let date = new Date(timestamp);
    let year = date.getFullYear();
    let month = (1 + date.getMonth()).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
    return year + '-' + month + '-' + day
}

const dateToPass = (date: string) => {
    return date.substring(0, 10).replace(/-/g, '')
}

export { formatDate, formatDateInput, dateToPass }