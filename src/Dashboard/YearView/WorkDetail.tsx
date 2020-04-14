import React from 'react'
import { Image, Card } from 'semantic-ui-react'
import { DataRow } from '../../types/Types'

type WorkDetailProps = {
    dataRow: DataRow
}

export default function WorkDetail({dataRow}: WorkDetailProps) {
    return (
        <Card style={{height: '700px'}}>
            <Image src={dataRow["w:posterPath"]} wrapped ui={false} />
            <Card.Content style={{height: '100%'}}>
                <Card.Header>{dataRow.work}</Card.Header>
                <Card.Meta>
                    <span>{dataRow["w:genreIds"]}</span>
                </Card.Meta>
                {dataRow["w:overview"] ?
                    <Card.Description style={{height: '250px', overflowY: 'scroll'}}>
                        {dataRow["w:overview"]}
                    </Card.Description>
                : ''}
            </Card.Content>
        </Card>
    )
}