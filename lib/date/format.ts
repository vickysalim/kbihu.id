const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
}

const dateToPass = (date: string) => {
    return date.substring(0, 10).replace(/-/g, '')
}

export { formatDate, dateToPass }