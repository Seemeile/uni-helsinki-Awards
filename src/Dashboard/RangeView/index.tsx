import React, { useCallback, useMemo } from 'react'
import { DataRow } from '../../types/Types'
import { Label } from 'semantic-ui-react'
import { BarChart, YAxis, XAxis, Tooltip, Bar } from 'recharts'

type RangeViewProps = {
    dataRows: DataRow[]
}

export default function RangeView({dataRows}: RangeViewProps) {
    
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

    const mostWinner = useMemo(() => {
        const winnerRows = dataRows.filter(row => row.winner === 'True')
        const groupedRowsByName = groupBy(winnerRows, 'name')
        const winsByName = Object.keys(groupedRowsByName).map(key => { return { name: key, wins: groupedRowsByName[key].length }})
        const winsByNameSorted = winsByName.sort((a ,b) => b.wins - a.wins)
        return winsByNameSorted.slice(0, 20)
    }, [dataRows])
    
    return (
        <BarChart
            width={1400}
            height={400}
            data={mostWinner}
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            layout="vertical"
          >
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" />
            <Tooltip />
            <Bar dataKey="wins" fill="#ff7300" maxBarSize={20} label radius={[10, 10, 10, 10]} />
        </BarChart>
    )
}