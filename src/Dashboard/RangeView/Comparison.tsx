import React, { useCallback, useMemo, useState } from 'react'
import { DataRow } from '../../types/Types'
import { Label, Grid, Segment, Dropdown, Header } from 'semantic-ui-react'
import { BarChart, YAxis, XAxis, Tooltip, Bar, AreaChart, Area, LabelList, Legend, TooltipPayload } from 'recharts'
import { groupBy } from '../../utils/groupBy'
import { toProperCase } from '../../utils/toProperCase'

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
                categories: new Set(years[year].map((row: DataRow) => row.category))
            }
        })
    }, [dataRows])

    const handleClick = useCallback(({activeLabel}) => {
        onClick(activeLabel)
    }, [onClick])

    const categoryTooltipFormatter = useCallback((
        value: string | number | (string | number)[], 
        name: string, 
        entry: TooltipPayload, 
        index: number
    ) => {
        const text: any[] = []
        text.push(value)
        const currentYear: string = entry.payload.year
        const prevYear: string = String(Number(currentYear) - 1)
        const prevYearData = data.find(element => element.year === prevYear)
        if (prevYearData) {
            const minus = Array.from(prevYearData.categories).filter(
                (cat: any) => !Array.from(entry.payload.categories).includes(cat)
            )
            const plus = Array.from(entry.payload.categories).filter(
                (cat: any) => !Array.from(prevYearData.categories).includes(cat)
            )
            if (plus.length > 0) {
                text.push(<p>Added (compared to {prevYear}):<ul>{plus.map((el: any) => <li>{toProperCase(el)}</li>)}</ul></p>)
            }
            if (minus.length > 0) {
                text.push(<p>Removed (compared to {prevYear}):<ul>{minus.map((el: any) => <li>{toProperCase(el)}</li>)}</ul></p>)
            }
        }
        return (<div>{text.map((el: string) => el)}</div>)
    }, [data])
    
    return (
        <>
            <Header>Comparisons</Header>
            <div style={{display: 'flex', justifyContent: 'center'}}>
                <div style={{width: '50%'}}>
                    <Dropdown
                        fluid
                        selection
                        options={options.map(option => { return {key: option, text: option, value: option}})}
                        value={comparisonState}
                        onChange={(e, {value}) => setComparisonState('' + value)}
                    />
                </div>
            </div>
            {comparisonState === 'Gender' ?
                <AreaChart 
                    width={800} 
                    height={400} 
                    data={data} 
                    onClick={handleClick} 
                    margin={{ top: 20, right: 80, left: 20, bottom: 5 }}
                    style={{color: 'black'}}
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
                        name='male'
                        dataKey="gender.male"
                        stroke="#ff7300"
                        fill="#ff7300"
                        dot
                    />
                    <Area
                        stackId="0"
                        type="monotone"
                        name='female'
                        dataKey="gender.female"
                        stroke="#82ca9d"
                        fill="#82ca9d"
                        dot
                    />
                    <Area
                        stackId="0"
                        type="monotone"
                        name='other'
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
                    style={{color: 'black'}}
                >
                    <XAxis dataKey='year'/>
                    <YAxis yAxisId={0}/>
                    <Tooltip formatter={categoryTooltipFormatter}/>
                    <Legend iconType='rect'/>
                    <Area
                        stackId="0"
                        type="monotone"
                        name='categories'
                        dataKey="categories.size"
                        stroke="#ff7300"
                        fill="#ff7300"
                        dot
                    />
                </AreaChart>
            }
        </>
    )
}