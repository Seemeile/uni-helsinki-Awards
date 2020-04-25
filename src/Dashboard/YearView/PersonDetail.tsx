import React from 'react'
import { Image, Card } from 'semantic-ui-react'
import { DataRow } from '../../types/Types'

type PersonDetailProps = {
    dataRow: DataRow
}

export default function PersonDetail({dataRow}: PersonDetailProps) {
    return (
        <>
            <Image src={dataRow["p:profilePath"]} wrapped ui={false}/>
            <Card.Content>
                <Card.Header>{dataRow.name}</Card.Header>
                {dataRow["p:knownForDepartment"] ? 
                    <Card.Meta>    
                        <span>Known for: {dataRow["p:knownForDepartment"]}</span>
                    </Card.Meta>
                : ''}
                {dataRow["p:biography"] ?
                    <Card.Description style={{maxHeight: '280px', overflowY: 'scroll', scrollbarColor: 'white #1b1c1d'}}>
                        <br/>{dataRow["p:biography"]}
                    </Card.Description>
                : ''}
            </Card.Content>
        </>
    )
}