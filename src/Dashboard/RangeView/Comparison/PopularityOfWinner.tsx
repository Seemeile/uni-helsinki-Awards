import React from 'react'
import { DataRow } from '../../../types/Types'
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'
import { groupBy } from '../../../utils/groupBy'

type PopularityOfWinnerProps = {
    years: any
}

export default function PopularityOfWinner({years}: PopularityOfWinnerProps) {
    const popularityData = Object.keys(years).map(year => {
        const categories = groupBy(years[year], 'category')
        Object.keys(categories).map(category => {
            const winner: Array<DataRow> = categories[category].filter((row: DataRow) => row.winner === 'True')
            if (winner.length > 0) {
                const winnerPopularity = winner[0]["p:popularity"]
            }
        })

        
        return {
            year: year,
            winnerPopularity: years[year].filter((row: DataRow) => row.winner === 'True')[0]
        }
    })
    return (
        <RadarChart cx={300} cy={250} outerRadius={150} width={window.innerWidth / 1.7} height={400} data={[]}>
            <PolarGrid />
            <PolarAngleAxis dataKey="year" />
            <PolarRadiusAxis />
            <Radar name="Mike" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
        </RadarChart>
    )
}