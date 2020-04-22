import { DataRow } from "../types/Types"

const groupBy = (data: Array<any>, key: any) => {
    return data.reduce((storage, item) => {
        // get the first instance of the key by which we're grouping
        const group = item[key];
        // set `storage` for this instance of group to the outer scope (if not empty) or initialize it
        storage[group] = storage[group] || [];
        // add this item to its group within `storage`
        storage[group].push(item);
        // return the updated storage to the reduce function, which will then loop through the next 
        return storage; 
    }, {})
}

export const mostWinsByName = (dataRows: DataRow[]) => {
    const winnerRows = dataRows.filter(row => row.winner === 'True')
    const groupedRowsByName = groupBy(winnerRows, 'name')
    const winsByName = Object.keys(groupedRowsByName).map(key => { 
        return { name: key, wins: groupedRowsByName[key].length }
    })
    const winsByNameSorted = winsByName.sort((a ,b) => b.wins - a.wins)
    return winsByNameSorted.slice(0, 8)
}

export const mostNominationsByName = (dataRows: DataRow[]) => {
    const groupedRowsByName = groupBy(dataRows, 'name')
    const nominationsByName = Object.keys(groupedRowsByName).map(key => { 
        return { name: key, nominations: groupedRowsByName[key].length }
    })
    const nominationsByNameSorted = nominationsByName.sort((a ,b) => b.nominations - a.nominations)
    return nominationsByNameSorted.slice(0, 8)
}