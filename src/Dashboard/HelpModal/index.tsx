import React from 'react'
import { Grid, Header, Segment, Modal, Image } from 'semantic-ui-react'
import selectHelp from '../../data/selectHelp.jpg'
import yearHelp from '../../data/yearHelp.jpg'
import rangeHelp from '../../data/rangeHelp.jpg'

type HelpModalProps = {
    open: boolean
    handleHelpModalClose: () => void
}

export default function HelpModal({open, handleHelpModalClose}: HelpModalProps) {
    return (
        <Modal basic dimmer='blurring' closeIcon open={open} onClose={handleHelpModalClose}>
            <Modal.Header>How to use</Modal.Header>
            <Modal.Content>
                <Grid columns={2} stackable textAlign='center'>
                    <Grid.Column verticalAlign='middle'>
                        <Segment inverted style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                            <Image src={selectHelp} size='medium'/>
                            <Header>1. Select a dataset</Header>
                        </Segment>
                    </Grid.Column>
                    <Grid.Column>
                        <Grid.Row verticalAlign='middle'>
                            <Grid.Column>
                                <Segment inverted style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                    <Image src={yearHelp} size='small'/>
                                    <Header>2. Shrink regulator to select a single year</Header>
                                </Segment>
                            </Grid.Column>
                            <Grid.Column style={{marginTop: '5px'}}>
                                <Segment inverted style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                    <Image src={rangeHelp} size='small'/>
                                    <Header>3. Drag regulator to select a range of years</Header>
                                </Segment>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid.Column>
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        <label>Datasets from www.kaggle.com, enriched with data from www.themoviedb.org</label>
                        <label>Background Icon made by Eucalyp from www.flaticon.com</label>
                    </div>
                </Grid>
                
            </Modal.Content>
        </Modal>
    )
}

/*

"Icon made by Eucalyp from www.flaticon.com"
*/