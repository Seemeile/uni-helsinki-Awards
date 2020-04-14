import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { Table, Image, Header, Label, Icon, Segment, Card } from 'semantic-ui-react'
import { DataRow } from '../../types/Types'
import styled from 'styled-components'

const SelectableCell = styled(Table.Cell)`
    @media (hover: hover) {
        :hover {
            background: #f2f3f4;
            cursor: pointer;
        }
    }
`

type AwardTableProps = {
    dataRows: DataRow[]
    showPersonDetail: (row: DataRow) => void
    showWorkDetail: (row: DataRow) => void
}

export default function AwardTable({dataRows, showPersonDetail, showWorkDetail}: AwardTableProps) {
    const getGenderIcon = useCallback((gender: string) => {
        switch (gender) {
            case 'male':
                return <Icon size='large' name='mars'/>
            case 'female':
                return <Icon size='large' name='venus'/>
            default:
                return <Icon size='large' name='genderless'/>
        }
    }, [])

    const categoryCache = new Set()
    const getCategoryRow = useCallback((row: DataRow) => {
        if (categoryCache.has(row.category)) {
            return null
        } else {
            categoryCache.add(row.category)
            const rowspan = dataRows.filter(dataRow => dataRow.category === row.category).length
            return <Table.Cell rowSpan={rowspan}>{row.category}</Table.Cell>
        }
    }, [dataRows, categoryCache])

    return (
        <div style={{height: '700px', overflowY: 'scroll'}}>
            <Table celled>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Category</Table.HeaderCell>
                        <Table.HeaderCell>Name</Table.HeaderCell>
                        <Table.HeaderCell>Sex</Table.HeaderCell>
                        <Table.HeaderCell>Work</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {dataRows.map((row, index) => {
                        return (
                            <Table.Row key={index}>
                                {getCategoryRow(row)}
                                <SelectableCell style={{display: 'flex', flexDirection: 'row'}} onClick={() => showPersonDetail(row)}>
                                    {row.winner === 'True' ? 
                                        <Label ribbon style={{height: '50%', marginTop: '8px'}}>Winner</Label> 
                                    : ''}
                                    <Image rounded avatar src={row["p:profilePath"]} size='mini' />
                                    <div style={{marginLeft: '8px', marginTop: '15px'}}>
                                        {row.name}
                                    </div>
                                </SelectableCell>
                                <Table.Cell>{getGenderIcon(row["p:gender"])}</Table.Cell>
                                <SelectableCell onClick={() => showWorkDetail(row)}>{row.work}</SelectableCell>
                            </Table.Row>
                        )
                    })}
                </Table.Body>
            </Table>
        </div>
    )
}