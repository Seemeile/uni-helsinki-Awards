import React from 'react'
import { Image, Card } from 'semantic-ui-react'
import { DataRow } from '../../types/Types'

type PersonDetailProps = {
    dataRow: DataRow
}

export default function PersonDetail({dataRow}: PersonDetailProps) {
    return (
        <Card style={{height: window.innerHeight - 100, backgroundColor: '#333'}}>
            <Image src={dataRow["p:profilePath"]} wrapped ui={false} />
            <Card.Content style={{height: '100%'}}>
                <Card.Header style={{color: 'rgba(255,255,255,.9)'}}>{dataRow.name}</Card.Header>
                {dataRow["p:knownForDepartment"] ? 
                    <Card.Meta style={{color: 'rgba(255,255,255,.9)'}}>
                        <span>Known for: {dataRow["p:knownForDepartment"]}</span>
                    </Card.Meta>
                : ''}
                {dataRow["p:biography"] ?
                    <Card.Description style={{height: '250px', overflowY: 'scroll', color: 'rgba(255,255,255,.9)'}}>
                        {dataRow["p:biography"]}
                    </Card.Description>
                : ''}
            </Card.Content>
        </Card>
    )
}