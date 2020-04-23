import React, { useCallback, useState } from 'react'
import { DataRow } from '../../types/Types'
import AwardTable from './AwardTable'
import PersonDetail from './PersonDetail'
import WorkDetail from './WorkDetail'
import { Menu, Card, Grid } from 'semantic-ui-react'
 
type YearViewProps = {
    dataRows: DataRow[]
    detailRow: DataRow
    dispatch: any
}

export default function YearView({dataRows, detailRow, dispatch}: YearViewProps) {
    const showDetail = useCallback((row: DataRow) => {
        dispatch({ type: 'setDetail', payload: row })
    }, [dispatch])
    const [detailView, setDetailView] = useState('person')
    return (
        <div style={{width: '90%', marginTop: '10px', marginLeft: '5%', display: 'flex', flexDirection: 'row'}}>
            <Grid columns='2' style={{width: '100%'}}>
                <Grid.Column width='12'>
                    <AwardTable dataRows={dataRows} showDetail={showDetail}/>
                </Grid.Column>
                <Grid.Column width='4'>
                    <Card style={{minWidth: '150px'}}>
                        <Menu pointing secondary>
                            <Menu.Item
                                name='person'
                                active={detailView === 'person'}
                                onClick={() => setDetailView('person')}
                            />
                            <Menu.Item
                                name='work'
                                active={detailView === 'work'}
                                onClick={() => setDetailView('work')}
                            />
                        </Menu>
                        {detailView === 'person' ?
                            <PersonDetail dataRow={detailRow}/>
                            :
                            <WorkDetail dataRow={detailRow}/>
                        }
                    </Card>
                </Grid.Column>
            </Grid>
        </div>
    )
}