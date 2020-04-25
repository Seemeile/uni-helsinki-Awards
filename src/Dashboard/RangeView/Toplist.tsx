import React, { useCallback, useState } from 'react'
import { DataRow } from '../../types/Types'
import { Dropdown, Header } from 'semantic-ui-react'
import { BarChart, YAxis, XAxis, Tooltip, Bar } from 'recharts'
import { groupBy } from '../../utils/groupBy'

type ToplistProps = {
    dataRows: DataRow[]
    onClick: (year: number) => void
}

const options = ['Most wins by name', 'Most nominations by name']

export default function Toplist({dataRows, onClick}: ToplistProps) {
    const [toplistState, setToplistState] = useState(options[0])

    const getData = useCallback(() => {
        switch (toplistState) {
            case 'Most wins by name':
                const groupedWinners: Array<any> = groupBy(dataRows.filter(row => row.winner === 'True'), 'name')
                return Object.keys(groupedWinners)
                    .map((name: any) => { return { name, value: groupedWinners[name].length }})
                    .sort((a, b) => b.value - a.value)
                    .slice(0, 6)
            case 'Most nominations by name':
                const groupedNames: Array<any> = groupBy(dataRows, 'name')
                return Object.keys(groupedNames)
                    .map((name: any) => { return { name, value: groupedNames[name].length }})
                    .sort((a, b) => b.value - a.value)
                    .slice(0, 6)
            default:
                return []
        }
    }, [dataRows, toplistState])

    return (
        <>
            <Header>Toplists</Header>
            <div style={{display: 'flex', justifyContent: 'center'}}>
                <div style={{width: '50%'}}>
                    <Dropdown
                        fluid
                        selection
                        options={options.map(option => { return {key: option, text: option, value: option}})}
                        value={toplistState}
                        onChange={(e, {value}) => setToplistState('' + value)}
                    />
                </div>
            </div>
            <BarChart
                width={window.innerWidth / 3}
                height={400}
                data={getData()}
                margin={{ top: 20, right: 20, bottom: 20, left: 30 }}
                layout='vertical'
                style={{color: 'black'}}
            >
                <XAxis dataKey='value' type='number' name='value'/>
                <YAxis dataKey='name' type='category' name='name' tickFormatter={(value: any) => value.replace(/-/g, ' ')}/>
                <Tooltip />
                <Bar dataKey='value' fill='#21ba45' maxBarSize={20} label radius={[10, 10, 10, 10]} />
            </BarChart>
        </>
    )
}