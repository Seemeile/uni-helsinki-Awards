export const toProperCase = (string: string) => {
    return string.trim().split(' ').map(w => {
        if (w[0] === '(') {
            return '(' + w[1].toUpperCase() + w.substr(2).toLowerCase()
        }
        return w[0].toUpperCase() + w.substr(1).toLowerCase()
    }).join(' ')
}