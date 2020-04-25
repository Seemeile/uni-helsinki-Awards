import React, { useCallback, useState } from 'react'
import { DataRow } from '../../../types/Types'
import { Label, Dropdown, Header } from 'semantic-ui-react'
import { YAxis, XAxis, Tooltip, AreaChart, Area, Legend, TooltipPayload } from 'recharts'
import { groupBy } from '../../../utils/groupBy'
import { toProperCase } from '../../../utils/toProperCase'
import PopularityOfWinner from './PopularityOfWinner'

type ComparisonProps = {
    dataRows: DataRow[]
    onClick: (year: number) => void
}

const options = [
    'Gender distribution', 
    'Amount of Categories', 
    'Average age of Nominees',
    'Popularity of Winners compared to rivals'
]

export default function Comparison({dataRows, onClick}: ComparisonProps) {
    const [comparisonState, setComparisonState] = useState(options[0])
    
    const handleClick = useCallback((e: any) => {
        if (e && e.activeLabel) {
            onClick(e.activeLabel)
        }
    }, [onClick])

    const getGraph = useCallback(() => {
        const years = groupBy(dataRows, 'year')
        switch (comparisonState) {
            case 'Gender distribution':
                const genderData = Object.keys(years).map(year => {
                    return {
                        year: year,
                        male: years[year].filter((person: DataRow) => person['p:gender'] === 'male').length,
                        female: years[year].filter((person: DataRow) => person['p:gender'] === 'female').length,
                        other: years[year].filter((person: DataRow) => person['p:gender'] === 'other').length
                    }
                })
                return (
                    <AreaChart
                        width={window.innerWidth / 1.7}
                        height={400} 
                        data={genderData} 
                        onClick={handleClick} 
                        margin={{ top: 20, right: 80, left: 20, bottom: 5 }}
                    >
                        <XAxis dataKey='year'/>
                        <YAxis yAxisId={0}>
                            <Label position='top' offset={10}>Nominations</Label>
                        </YAxis>
                        <Tooltip contentStyle={{color: 'black'}}/>
                        <Legend iconType='rect' />
                        <Area
                            stackId="0"
                            type="monotone"
                            name='male'
                            dataKey="male"
                            stroke="#ff7300"
                            fill="#ff7300"
                            dot
                        />
                        <Area
                            stackId="0"
                            type="monotone"
                            name='female'
                            dataKey="female"
                            stroke="#82ca9d"
                            fill="#82ca9d"
                            dot
                        />
                        <Area
                            stackId="0"
                            type="monotone"
                            name='other'
                            dataKey="other"
                            stroke="#387908"
                            fill="#387908"
                            dot
                        />
                    </AreaChart>
                )
            case 'Amount of Categories':
                const categoryData = Object.keys(years).map(year => {
                    return {
                        year: year,
                        categories: new Set(years[year].map((row: DataRow) => row.category))
                    }
                })
                const categoryTooltipFormatter = (
                    value: string | number | (string | number)[], 
                    name: string, 
                    entry: TooltipPayload, 
                    index: number
                ) => {
                    const text: any[] = []
                    text.push(value)
                    const currentYear: string = entry.payload.year
                    const prevYear: string = String(Number(currentYear) - 1)
                    const prevYearData = categoryData.find(element => element.year === prevYear)
                    if (prevYearData) {
                        const minus = Array.from(prevYearData.categories).filter(
                            (cat: any) => !Array.from(entry.payload.categories).includes(cat)
                        )
                        const plus = Array.from(entry.payload.categories).filter(
                            (cat: any) => !Array.from(prevYearData.categories).includes(cat)
                        )
                        if (plus.length > 0) {
                            text.push(<><br/><br/>Added (compared to {prevYear}):
                                <ul>{plus.map((el: any, index: number) => <li key={index}>{toProperCase(el)}</li>)}
                                </ul></>
                            )
                        }
                        if (minus.length > 0) {
                            text.push(<><br/>Removed (compared to {prevYear}):
                                <ul>{minus.map((el: any, index: number) => <li key={index}>{toProperCase(el)}</li>)}
                                </ul></>
                            )
                        }
                    }
                    return (<div>{text.map((el: string) => el)}</div>)
                }
                return (
                    <AreaChart 
                        width={window.innerWidth / 1.7} 
                        height={400} 
                        data={categoryData} 
                        onClick={handleClick} 
                        margin={{ top: 20, right: 80, left: 20, bottom: 5 }}
                    >
                        <XAxis dataKey='year'/>
                        <YAxis yAxisId={0}/>
                        <Tooltip formatter={categoryTooltipFormatter} contentStyle={{color: 'black'}}/>
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
                )
            case 'Average age of Nominees':
                const averageAgeData = Object.keys(years).map(year => {
                    const birthdays = years[year].filter((row: DataRow) => row["p:birthday"])
                    const avgBirthday: number = birthdays.map((row: DataRow) => {
                            const diff: number = new Date(year).getTime() - new Date(row["p:birthday"]).getTime()
                            const age: number = Math.floor(diff/31557600000); // Divide by 1000*60*60*24*365.25
                            return age
                        })
                        .reduce((acc: number, cur: number) => acc += cur) / birthdays.length
                    return {
                        year: year,
                        avgAge: Math.round(avgBirthday)
                    }
                })
                return (
                    <AreaChart 
                        width={window.innerWidth / 1.7} 
                        height={400} 
                        data={averageAgeData} 
                        onClick={handleClick} 
                        margin={{ top: 20, right: 80, left: 20, bottom: 5 }}
                    >
                        <XAxis dataKey='year'/>
                        <YAxis yAxisId={0}/>
                        <Tooltip contentStyle={{color: 'black'}}/>
                        <Area
                            stackId="0"
                            type="monotone"
                            name='average age'
                            dataKey="avgAge"
                            stroke="#ff7300"
                            fill="#ff7300"
                            dot
                        />
                    </AreaChart>
                )
            case 'Popularity of Winners compared to rivals':
                return <PopularityOfWinner years={years}/>
            default:
                return <></>
        }
    }, [comparisonState, dataRows, handleClick])
    
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
            {getGraph()}
        </>
    )
}