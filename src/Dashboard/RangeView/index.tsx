import React, { useCallback, useMemo, useState } from 'react'
import { DataRow } from '../../types/Types'
import { Label, Grid, Segment, Dropdown, Header } from 'semantic-ui-react'
import { BarChart, YAxis, XAxis, Tooltip, Bar } from 'recharts'
import Comparison from './Comparison'

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

type RangeViewProps = {
    dataRows: DataRow[]
    onYearChange: (year: number) => void
}

export default function RangeView({dataRows, onYearChange}: RangeViewProps) {
    const toplistOptions = useMemo(() => {
        return [{
            key: 'Most wins by name',
            text: 'Most wins by name',
            value: 'Most wins by name'
        }, {
            key: 'Most nominations by name',
            text: 'Most nominations by name',
            value: 'Most nominations by name'
        }]
    }, [])

    const [toplistState, setToplistState] = useState(toplistOptions[0])

    const mostWinsByName = useMemo(() => {
        const winnerRows = dataRows.filter(row => row.winner === 'True')
        const groupedRowsByName = groupBy(winnerRows, 'name')
        const winsByName = Object.keys(groupedRowsByName).map(key => { return { name: key, wins: groupedRowsByName[key].length }})
        const winsByNameSorted = winsByName.sort((a ,b) => b.wins - a.wins)
        return winsByNameSorted.slice(0, 8)
    }, [dataRows])

    const mostNominationsByName = useMemo(() => {
        const groupedRowsByName = groupBy(dataRows, 'name')
        const nominationsByName = Object.keys(groupedRowsByName).map(key => { return { name: key, nominations: groupedRowsByName[key].length }})
        const nominationsByNameSorted = nominationsByName.sort((a ,b) => b.nominations - a.nominations)
        return nominationsByNameSorted.slice(0, 8)
    }, [dataRows])

    const handleToplistChange = useCallback((value: any) => {
        const toplistOption = toplistOptions.find(option => option.value === value)
        if (toplistOption) {
            setToplistState(toplistOption)
        } 
    }, [toplistOptions, setToplistState])

    const getToplistData = useMemo(() => {
        switch (toplistState.value) {
            case 'Most wins by name':
                return mostWinsByName
            case 'Most nominations by name':
                return mostNominationsByName
            default:
                return mostWinsByName
        }
    }, [mostWinsByName, mostNominationsByName, toplistState])

    return (
        <div style={{margin: '10px 10px 10px 10px'}}>
            <Grid>
                <Grid.Column width='10'>
                    <Segment color='red' >
                        <Comparison dataRows={dataRows} onClick={onYearChange}/>
                    </Segment>
                </Grid.Column>
                <Grid.Column width='6'>
                    <Segment color='green'>
                        <Header>Toplists</Header>
                        <Dropdown
                            fluid
                            selection
                            options={toplistOptions}
                            value={toplistState.value}
                            onChange={(e, {value}) => handleToplistChange(value)}
                        />
                        <BarChart
                            width={450}
                            height={400}
                            data={getToplistData}
                            margin={{ top: 20, right: 20, bottom: 20, left: 30 }}
                            layout='vertical'
                        >
                            <XAxis dataKey='wins' type='number' name='wins'/>
                            <YAxis dataKey='name' type='category' name='name'/>
                            <Tooltip />
                            <Bar dataKey='wins' fill='#21ba45' maxBarSize={20} label radius={[10, 10, 10, 10]} />
                        </BarChart>
                    </Segment>
                </Grid.Column>
            </Grid>
        </div>
    )
}