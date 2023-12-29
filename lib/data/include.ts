const dataInclude = (field: any, term: any) => {
    return field.toLowerCase().includes(term.toLowerCase())
}

const multipleDataInclude = (fields: any, term: any) => {
    return fields.some((field: any) => dataInclude(field, term))
}

export { dataInclude, multipleDataInclude }