import React, { useCallback, useMemo, useState } from 'react'
import { DataRow } from '../../types/Types'
import { Label, Grid, Segment, Dropdown, Header } from 'semantic-ui-react'
import { BarChart, YAxis, XAxis, Tooltip, Bar, AreaChart, Area, LabelList, Legend } from 'recharts'
import { groupBy } from '../../utils/groupBy'

type ComparisonProps = {
    dataRows: DataRow[]
    onClick: (year: number) => void
}

const options = ['Gender', 'Categories']

export default function Comparison({dataRows, onClick}: ComparisonProps) {
    const [comparisonState, setComparisonState] = useState(options[0])
    
    const data = useMemo(() => {
        const years = groupBy(dataRows, 'year')
        return Object.keys(years).map(year => {
            return {
                year: year,
                gender: {
                    male: years[year].filter((person: DataRow) => person['p:gender'] === 'male').length,
                    female: years[year].filter((person: DataRow) => person['p:gender'] === 'female').length,
                    other: years[year].filter((person: DataRow) => person['p:gender'] === 'other').length
                },
                categories: new Set(years[year].map((row: DataRow) => row.category)).size
            }
        })
    }, [dataRows])

    const handleClick = useCallback(({activeLabel}) => {
        onClick(activeLabel)
    }, [onClick])

    return (
        <>
            <Header>Comparisons</Header>
            <Dropdown
                fluid
                selection
                options={options.map(option => { return {key: option, text: option, value: option}})}
                value={comparisonState}
                onChange={(e, {value}) => setComparisonState('' + value)}
            />
            {comparisonState === 'Gender' ?
                <AreaChart 
                    width={800} 
                    height={400} 
                    data={data} 
                    onClick={handleClick} 
                    margin={{ top: 20, right: 80, left: 20, bottom: 5 }}
                >
                    <XAxis dataKey='year'/>
                    <YAxis yAxisId={0}>
                        <Label position="top" offset={10}>Nominations</Label>
                    </YAxis>
                    <Tooltip/>
                    <Legend iconType='rect'/>
                    <Area
                        stackId="0"
                        type="monotone"
                        dataKey="gender.male"
                        stroke="#ff7300"
                        fill="#ff7300"
                        dot
                    />
                    <Area
                        stackId="0"
                        type="monotone"
                        dataKey="gender.female"
                        stroke="#82ca9d"
                        fill="#82ca9d"
                        dot
                    />
                    <Area
                        stackId="0"
                        type="monotone"
                        dataKey="gender.other"
                        stroke="#387908"
                        fill="#387908"
                        animationBegin={1300}
                        dot
                        hide 
                    />
                </AreaChart>
            :
                <AreaChart 
                    width={800} 
                    height={400} 
                    data={data} 
                    onClick={handleClick} 
                    margin={{ top: 20, right: 80, left: 20, bottom: 5 }}
                >
                    <XAxis dataKey='year'/>
                    <YAxis yAxisId={0}>
                        <Label position="top" offset={10}>Nominations</Label>
                    </YAxis>
                    <Tooltip/>
                    <Legend iconType='rect'/>
                    <Area
                        stackId="0"
                        type="monotone"
                        dataKey="categories"
                        stroke="#ff7300"
                        fill="#ff7300"
                        dot
                    />
                </AreaChart>
            }
        </>
    )
}