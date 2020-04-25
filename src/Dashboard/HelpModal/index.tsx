import React, { useCallback } from 'react'
import { Button,
    Divider,
    Grid,
    Header,
    Icon,
    Search,
    Segment, 
    Modal } from 'semantic-ui-react'

type HelpModalProps = {
    open: boolean
    handleHelpModalClose: () => void
}

export default function HelpModal({open, handleHelpModalClose}: HelpModalProps) {
    return (
        <Modal closeIcon open={open} onClose={handleHelpModalClose}>
            <Modal.Header>How to use</Modal.Header>
            <Modal.Content>
                sources...
                <Segment>
                    <Grid columns={2} stackable textAlign='center'>
                        <Divider vertical>Or</Divider>
                        <Grid.Row verticalAlign='middle'>
                            <Grid.Column>
                                <Header icon>
                                    <Icon name='search' />
                                    Select a single year
                                </Header>
                                to show detailed information about that year
                            </Grid.Column>
                            <Grid.Column>
                                <Header icon>
                                    <Icon name='world' />
                                    Select a range of years
                                </Header>
                                to display history data
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
            </Segment>
            </Modal.Content>
        </Modal>
    )
}

/*

"Icon made by Eucalyp from www.flaticon.com"
*/