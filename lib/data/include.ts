const dataInclude = (field: any, filterTerm: any) => {
    return field.toString().toLowerCase().includes(filterTerm.toLowerCase())
}

const multipleDataInclude = (fields: any, filterTerm: any) => {
    return fields.some((field: any) => dataInclude(field, filterTerm))
}

export { dataInclude, multipleDataInclude }