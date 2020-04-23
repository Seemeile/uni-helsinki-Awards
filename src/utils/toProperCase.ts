export const toProperCase = (string: string) => {
    return string.split(' ').map(w => w[0].toUpperCase() + w.substr(1).toLowerCase()).join(' ')
}