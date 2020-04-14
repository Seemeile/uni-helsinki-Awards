import React, { useCallback } from 'react'
import { DataRow } from '../../types/Types'
import AwardTable from './AwardTable'
import PersonDetail from './PersonDetail'
import WorkDetail from './WorkDetail'
 
type YearViewProps = {
    dataRows: DataRow[]
    detailView: string
    detailRow: DataRow
    dispatch: any
}

export default function YearView({dataRows, detailView, detailRow, dispatch}: YearViewProps) {
    const showPersonDetail = useCallback((row: DataRow) => {
        dispatch({ type: 'setDetail', payload: {detailRow: row, detailView: 'person'} })
    }, [dispatch])

    const showWorkDetail = useCallback((row: DataRow) => {
        dispatch({ type: 'setDetail', payload: {detailRow: row, detailView: 'work'} })
    }, [dispatch])

    return (
        <div style={{width: '80%', marginTop: '10px', display: 'flex', flexDirection: 'row'}}>
            <div style={{width: '80%'}}>
                <AwardTable
                    dataRows={dataRows}
                    showPersonDetail={showPersonDetail}
                    showWorkDetail={showWorkDetail}
                />
            </div>
            <div style={{width: '20%'}}>>
                {detailView === 'person' ?
                    <PersonDetail dataRow={detailRow}/>
                    :
                    <WorkDetail dataRow={detailRow}/>
                }
            </div>
        </div>
    )
}