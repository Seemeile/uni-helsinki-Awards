import React, { useMemo, useCallback } from 'react'
import { Table, Image, Icon, Grid } from 'semantic-ui-react'
import { DataRow } from '../../types/Types'
import styled from 'styled-components'
import { groupBy } from '../../utils/groupBy'
import { toProperCase } from '../../utils/toProperCase'

const SelectableCell = styled(Table.Cell)`
    @media (hover: hover) {
        :hover {
            background: rgba(255,255,255,.3);
            cursor: pointer;
        }
    }
`

type AwardTableProps = {
    dataRows: DataRow[]
    showDetail: (row: DataRow) => void
}

export default function AwardTable({dataRows, showDetail}: AwardTableProps) {
    const rowsByCategory = useMemo(() => {
        return groupBy(dataRows, 'category')
    }, [dataRows])

    const categoryNamesDivided = useMemo(() => {
        const categoriesDivided: Array<string[]> = []
        const categories: string[] = Object.keys(rowsByCategory)
        for(let i = 0; i < categories.length; i += 2)
        {
            categoriesDivided.push(categories.slice(i, i + 2));
        }
        return categoriesDivided
    }, [rowsByCategory])

    const getGenderSign = useCallback((gender: string) => {
        if ('male' === gender) {
            return <Icon name='mars'/>
        } else if ('female' === gender) {
            return <Icon name='venus'/>
        }
        return <Icon name='genderless'/>
    }, [])

    return (
        <Grid style={{marginTop: '10px', maxHeight: window.innerHeight - 100, scrollbarColor: 'white #1b1c1d', overflowY: 'scroll'}}>
            {categoryNamesDivided.map((categoryNames: string[], index: number) =>
                <Grid.Row key={index} columns='2' style={{paddingTop: '0px'}}>
                    {categoryNames.map((categoryName: string, index: number) => 
                        <Grid.Column key={index}>
                            <Table inverted celled>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell textAlign='center'>
                                            {toProperCase(categoryName)}
                                        </Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {rowsByCategory[categoryName].map((row: DataRow, index: string) =>
                                        <Table.Row key={index}>
                                            <SelectableCell onClick={() => showDetail(row)}>
                                                <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                                                    {row.winner === 'True' ? 
                                                        <Icon name='winner' color='yellow'/>
                                                    : ''
                                                    }
                                                    {row["p:gender"] === '' || row["p:gender"] === 'other' || row["p:profilePath"].length === 0 ?
                                                        <Image rounded src={row["w:posterPath"]} size='mini' style={{marginLeft: '8px'}}/>
                                                    :
                                                        <Image rounded avatar src={row["p:profilePath"]} size='mini' style={{marginLeft: '8px'}}/>
                                                    }
                                                    <div style={{marginLeft: '8px'}}>
                                                        {row.name}{getGenderSign(row["p:gender"])}<br/><i>{row.work}</i>
                                                    </div>
                                                </div>
                                            </SelectableCell>
                                        </Table.Row>    
                                    )}
                                </Table.Body>
                            </Table>
                        </Grid.Column>             
                    )}
                </Grid.Row>
            )}
        </Grid>
    )
}