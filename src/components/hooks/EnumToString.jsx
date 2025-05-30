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

export const toTitleCase = (str) => {
  return str
    .replace(/([A-Z])/g, ' $1')  // Insert space before capital letters
    .replace(/^./, (char) => char.toUpperCase()); // Capitalize first letter
}

export const toCamelCase = (str) => {
  return str
    .toLowerCase()                                  // Lowercase the entire string
    .split('_')                                     // Split by underscores
    .map((word, index) =>
      index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
    )                                               // Capitalize first letter of each subsequent word
    .join('');                                      // Join them back
}