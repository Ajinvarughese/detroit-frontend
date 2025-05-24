export const convertToString = (value) => {
    return value
        .toLowerCase()
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
}

export const convertToEnum = (value) => {
    return value
        .toUpperCase()
        .split(' ')
        .join('_')
}