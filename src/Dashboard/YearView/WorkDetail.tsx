import React from 'react'
import { Image, Card } from 'semantic-ui-react'
import { DataRow } from '../../types/Types'

type WorkDetailProps = {
    dataRow: DataRow
}

export default function WorkDetail({dataRow}: WorkDetailProps) {
    return (
        <>
            <Image src={dataRow["w:posterPath"]} wrapped ui={false} />
            <Card.Content>
                <Card.Header>{dataRow.work}</Card.Header>
                <Card.Meta>
                    <span>{dataRow["w:genreIds"]}</span>
                </Card.Meta>
                {dataRow["w:overview"] ?
                    <Card.Description style={{maxHeight: '300px', overflowY: 'scroll', scrollbarColor: 'white #1b1c1d'}}>
                        {dataRow["w:overview"]}
                    </Card.Description>
                : ''}
            </Card.Content>
        </>
    )
}