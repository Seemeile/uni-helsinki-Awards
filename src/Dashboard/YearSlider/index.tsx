import React, { useState, useCallback, useEffect } from 'react'
import Slider from 'react-rangeslider'
import './yearslider.css'
import { DataRow } from '../../types/Types'
  
const getInitialSliderState = () => {
    return {
        value: 0,
        domain: [0, 1],
        labels: {}
    }
}

type YearSliderProps = {
    dataRows: DataRow[]
}

export default function YearSlider({dataRows}: YearSliderProps) {
    const [sliderState, setSliderState] = useState(getInitialSliderState())

    useEffect(() => {
        if (dataRows.length > 0) {
            const years = Array.from(new Set(dataRows.map(row => row.year))).map(Number)
            const labels: any = {}
            years.forEach(year => {
                if (year % 2 === 0) labels[year] = '' + year
            })
            setSliderState({
                value: years[0],
                domain: [years[0], years[years.length - 1]],
                labels
            })
        }
    }, [dataRows])

    const onSliderChange = useCallback((value: number) => {
        setSliderState({
            ...sliderState,
            value: value
        })
    }, [sliderState, setSliderState]);

    return (
        <div style={{marginLeft: '15px', marginRight: '15px', width: '100%'}}>
            <Slider
                min={sliderState.domain[0]}
                max={sliderState.domain[1]}
                value={sliderState.value}
                orientation='horizontal'
                labels={sliderState.labels}        
                onChange={onSliderChange}
            />
        </div>
    )
}