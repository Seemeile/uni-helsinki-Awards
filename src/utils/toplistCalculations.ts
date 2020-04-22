import { DataRow } from "../types/Types"
import { groupBy } from "./groupBy"

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