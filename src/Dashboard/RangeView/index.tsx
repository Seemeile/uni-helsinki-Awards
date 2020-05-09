import React, { useState } from 'react'
import { DataRow } from '../../types/Types'
import { Grid, Segment } from 'semantic-ui-react'
import Comparison from './Comparison'
import Toplist from './Toplist'
import Choropleth from './Choropleth'
import ReactTooltip from "react-tooltip";

type RangeViewProps = {
    dataRows: DataRow[]
    onYearChange: (year: number) => void
}

export default function RangeView({dataRows, onYearChange}: RangeViewProps) {
    const [tooltipState, setTooltipState] = useState('')
    return (
        <div style={{margin: '10px 10px 10px 10px'}}>
            <Grid>
                <Grid.Column width='10'>
                    <Segment inverted>
                        <Comparison dataRows={dataRows} onClick={onYearChange}/>
                    </Segment>
                </Grid.Column>
                <Grid.Column width='6'>
                    <Segment inverted>
                        <Toplist dataRows={dataRows} onClick={onYearChange}/>
                    </Segment>
                </Grid.Column>
            </Grid>
            <Segment inverted>
                <Choropleth dataRows={dataRows} setTooltipState={setTooltipState}/>
            </Segment>
            <ReactTooltip>{tooltipState}</ReactTooltip>
        </div>
    )
}