import React from 'react'
import { Image, Card } from 'semantic-ui-react'
import { DataRow } from '../types/Types'

type PersonDetailProps = {
    dataRow: DataRow
}

export default function PersonDetail({dataRow}: PersonDetailProps) {
    return (
        <Card style={{height: '700px'}}>
            <Image src={dataRow["p:profilePath"]} wrapped ui={false} />
            <Card.Content style={{height: '100%'}}>
                <Card.Header>{dataRow.name}</Card.Header>
                <Card.Meta>
                    <span>{dataRow["p:knownForDepartment"]}</span>
                </Card.Meta>
                {dataRow["p:biography"] ?
                    <Card.Description style={{height: '250px', overflowY: 'scroll'}}>
                        {dataRow["p:biography"]}
                    </Card.Description>
                : ''}
            </Card.Content>
        </Card>
    )
}