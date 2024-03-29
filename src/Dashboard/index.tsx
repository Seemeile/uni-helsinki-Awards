import React, { useCallback, useReducer, useMemo } from 'react'
import { Brush, Surface, CartesianAxis } from 'recharts'
import { Dropdown, Menu, Icon, Label, Loader } from 'semantic-ui-react'
import Papa from 'papaparse'
import { DataRow } from '../types/Types'
import YearView from './YearView'
import styled from 'styled-components'
import HelpModal from './HelpModal'
import RangeView from './RangeView'

const ClickableMenuItem = styled(Menu.Item)`
    @media (hover: hover) {
        :hover {
            background: #f2f3f4;
            cursor: pointer;
        }
    }
`

const readCSVData = async (filename: string): Promise<DataRow[]> => {
    return new Promise((resolve, reject) => {
        try {
            const githubBase = 'https://raw.githubusercontent.com/Seemeile/uni-helsinki-Awards/master/src/data/'
            Papa.parse(githubBase + filename, {
                header: true,
                download: true,
                skipEmptyLines: true,
                error(error) {
                    reject(error)
                },
                complete(results) {
                    resolve(results.data)
                },
            })
        } catch (error) {
            reject(error)
        }
    })
}

const createInitialState = (): ReducerStateProps => {
    return {
        datasetTitle: 'Select dataset',
        dataset: [],
        detail: {
            year: '',
            category: '',
            winner: '',
            name: '',
            work: '',
            'p:gender': '',
            'p:birthday': '',
            'p:birthplace': '',
            'p:deathday': '',
            'p:popularity': '',
            'p:biography': 'Select a person to get detailed information',
            'p:knownForDepartment': '',
            'p:profilePath': '',
            'w:posterPath': '',
            'w:genreIds': '',
            'w:popularity': '',
            'w:overview': 'Select a person to get detailed information'
        },
        brush: {
            data: [],
            startIndex: 0,
            endIndex: 0,
        },
        helpModal: false,
        pending: false
    }
}

type ReducerStateProps = {
    datasetTitle: string
    dataset: DataRow[]
    detail: DataRow
    brush: {
        data: string[]
        startIndex: number
        endIndex: number
    },
    helpModal: boolean
    pending: boolean
}

type ReducerActionProps = {
    type: 'reset'
    payload: ReducerStateProps
} | {
    type: 'setDetail'
    payload: DataRow
} | {
    type: 'setDataset'
    payload: { datasetTitle: string, dataset: DataRow[] }
} | {
    type: 'setPending'
    payload: { pending: boolean }
} | {
    type: 'setBrush'
    payload: { data: string[], startIndex: number, endIndex: number }
} | {
    type: 'setHelpModal'
    payload: { helpModal: boolean }
}

const reducer = (state: ReducerStateProps, action: ReducerActionProps) => {
    switch (action.type) {
        case 'reset':
            return action.payload
        case 'setDataset':
            return { ...state, datasetTitle: action.payload.datasetTitle, dataset: action.payload.dataset }
        case 'setDetail':
            return { 
                ...state, 
                detail: action.payload
            }
        case 'setPending':
            return { ...state, pending: action.payload.pending }
        case 'setBrush':
            return { 
                ...state, 
                brush: {
                    data: action.payload.data,
                    startIndex: action.payload.startIndex,
                    endIndex: action.payload.endIndex
                }
            }
        case 'setHelpModal':
            return {
                ...state,
                helpModal: action.payload.helpModal
            }
        default:
            return state
    }
}

export default function Dashboard() {
    const [state, dispatch] = useReducer(reducer, createInitialState())

    const handleHelpModalClick = useCallback(() => {
        dispatch({ type: 'setHelpModal', payload: { helpModal: true }})
    }, [dispatch])

    const handleHelpModalClose = useCallback(() => {
        dispatch({ type: 'setHelpModal', payload: { helpModal: false }})
    }, [dispatch])

    const changeDataset = useCallback(async (title: string, filename: string) => {
        dispatch({ type: 'setPending', payload: { pending: true }})
        const csvRows: DataRow[] = await readCSVData(filename)
        dispatch({ type: 'setDataset', payload: { datasetTitle: title, dataset: csvRows }})
        const yearsUnique = Array.from(new Set(csvRows.map(row => row.year)))
        dispatch({ type: 'setBrush' , payload: { 
            data: yearsUnique,
            startIndex: 0,
            endIndex: 0
        }})
        dispatch({ type: 'setPending', payload: { pending: false }})
    }, [dispatch])

    const handleOscarAwardsSelect = useCallback(() => {
        changeDataset('Oscar Awards 1928 - 2020', 'the_oscar_awards.csv')
    }, [changeDataset])

    const handleEmmyAwardsSelect = useCallback(() => {
        changeDataset('The Emmy Awards 1949 - 2019', 'the_emmy_awards.csv')
    }, [changeDataset])

    const handleGoldenGlobeAwardsSelect = useCallback(() => {
        changeDataset('Golden Globe Awards 1944 - 2020', 'golden_globe_awards.csv')
    }, [changeDataset])

    const handleBrushUpdate = useCallback((indizes: {startIndex: number, endIndex: number}) => {
        dispatch({ type: 'setBrush' , payload: {
            ...state.brush,
            startIndex: indizes.startIndex,
            endIndex: indizes.endIndex
        }})
    }, [state.brush])

    const getBrushTicks = useMemo(() => {
        if (state.brush.data.length > 0) {
            const widthPerTick = (window.innerWidth / 1.5) / state.brush.data.length
            return state.brush.data.map(year => {
                return {
                    value: year,
                    coordinate: state.brush.data.indexOf(year) * widthPerTick
                }
            })
        }
        return []
    }, [state.brush.data])

    const selectedYears: {year1: string, year2: string} = useMemo(() => {
        return {
            year1: state.brush.data[state.brush.startIndex],
            year2: state.brush.data[state.brush.endIndex]
        }
    }, [state.brush])

    const handleYearChange = useCallback((year: number) => {
        const brushIndex = state.brush.data
            .map((brushYear, index) => brushYear === String(year) ? index : null)
            .filter(Boolean)
        if (brushIndex.length > 0) {
            handleBrushUpdate({ startIndex: Number(brushIndex[0]), endIndex: Number(brushIndex[0]) })
        }
    }, [state.brush.data, handleBrushUpdate])

    return (
        <>
            <Menu inverted attached='top' size='large'>
                <Dropdown item simple text={state.datasetTitle}>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={handleOscarAwardsSelect}>Academy Awards 1928 - 2020</Dropdown.Item>
                        <Dropdown.Item onClick={handleEmmyAwardsSelect}>Emmy Awards 1949 - 2019</Dropdown.Item>
                        <Dropdown.Item onClick={handleGoldenGlobeAwardsSelect}>Golden Globe Awards 1944 - 2020</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                <Menu.Item style={{width: window.innerWidth / 1.5}}>
                    {state.dataset.length > 0 ? 
                        <Surface width={window.innerWidth / 1.5} height={50}>
                            <Brush
                                startIndex={state.brush.startIndex}
                                endIndex={state.brush.endIndex}
                                x={0}
                                y={10}
                                width={window.innerWidth / 1.5}
                                height={30}
                                data={state.brush.data}
                                onChange={handleBrushUpdate}
                                tickFormatter={(index) => state.brush.data[index]}
                            >
                                <CartesianAxis
                                    orientation='top'
                                    minTickGap={40}
                                    viewBox={{ x: 0, y: 0, width: window.innerWidth / 1.5, height: 30 }}
                                    ticks={getBrushTicks}
                                    fontSize={10}
                                />
                            </Brush>
                        </Surface>
                    :
                        ''
                    }
                </Menu.Item>
                <div style={{width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white'}}>
                    {state.pending ?
                        <Loader active inline size='small' />
                    :
                        selectedYears.year1 !== selectedYears.year2 ?
                            <label>{selectedYears.year1} - {selectedYears.year2}</label>
                        : 
                            <label>{selectedYears.year1}</label>
                    }
                </div>
                <ClickableMenuItem position='right' onClick={handleHelpModalClick}>
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                        <Icon size='big' name='help circle'/>
                    </div>
                </ClickableMenuItem>
            </Menu>
            {state.dataset.length !== 0 && !state.pending ?
                selectedYears.year1 === selectedYears.year2 ?
                    <YearView 
                        dataRows={state.dataset.filter(row => row.year === selectedYears.year1)} 
                        detailRow={state.detail} 
                        dispatch={dispatch}
                    />
                :
                    <RangeView
                        dataRows={
                            state.dataset.filter(
                                row => row.year >= selectedYears.year1 && row.year <= selectedYears.year2)}
                        onYearChange={handleYearChange}
                    />
            :
                <div style={{width: '100%', marginTop: '100px', textAlign: 'center'}}> 
                    <Label>Please select a dataset</Label>
                </div>
            }
            <HelpModal open={state.helpModal} handleHelpModalClose={handleHelpModalClose}/>
        </>
    )
}
