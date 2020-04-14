import React, { useCallback, useReducer, useMemo } from 'react'
import { Brush, Surface, CartesianAxis } from 'recharts'
import { Dropdown, Menu, Icon, Label } from 'semantic-ui-react'
import Papa from 'papaparse'
import { DataRow } from '../types/Types'
import YearView from './YearView'

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
        detailRow: {
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
            'p:biography': '',
            'p:knownForDepartment': 'Select a person to get detailed information',
            'p:profilePath': '',
            'w:posterPath': '',
            'w:genreIds': '',
            'w:popularity': '',
            'w:overview': ''
        },
        detailView: 'person',
        brush: {
            data: [],
            startIndex: 0,
            endIndex: 0,
        },
        pending: false
    }
}

type ReducerStateProps = {
    datasetTitle: string
    dataset: DataRow[]
    detailRow: DataRow
    detailView: 'person' | 'work'
    brush: {
        data: string[],
        startIndex: number,
        endIndex: number
    },
    pending: boolean
}

type ReducerActionProps = {
    type: 'setDetail'
    payload: { detailRow: DataRow, detailView: 'person' | 'work' }
} | {
    type: 'setDataset'
    payload: { datasetTitle: string, dataset: DataRow[] }
} | {
    type: 'setPending'
    payload: { pending: boolean }
} | {
    type: 'setBrush'
    payload: { data: string[], startIndex: number, endIndex: number }
}

const reducer = (state: ReducerStateProps, action: ReducerActionProps) => {
    switch (action.type) {
        case 'setDataset':
            return { ...state, datasetTitle: action.payload.datasetTitle, dataset: action.payload.dataset }
        case 'setDetail':
            return { ...state, detailRow: action.payload.detailRow, detailView: action.payload.detailView }
        case 'setPending':
            return { ...state, pending: action.payload.pending }
        case 'setBrush':
            return { ...state, brush: {
                data: action.payload.data,
                startIndex: action.payload.startIndex,
                endIndex: action.payload.endIndex
            }}
        default:
            return state
    }
}

export default function Dashboard() {
    const [state, dispatch] = useReducer(reducer, createInitialState())

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
        changeDataset('The Oscar Awards 1928 - 2020', 'the_oscar_award.csv')
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
            const widthPerTick = 900 / state.brush.data.length
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

    console.log(selectedYears.year1)
    console.log(selectedYears.year2)

    return (
        <>
            <Menu attached='top' size='large'>
                <Dropdown item simple text={state.datasetTitle}>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={handleOscarAwardsSelect}>Oscar Awards 1928 - 2020</Dropdown.Item>
                        <Dropdown.Item onClick={handleEmmyAwardsSelect}>The Emmy Awards 1949 - 2019</Dropdown.Item>
                        <Dropdown.Item onClick={handleGoldenGlobeAwardsSelect}>Golden Globe Awards 1944 - 2020</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                <Menu.Item>
                    <Surface width={900} height={50}>
                        <Brush
                            startIndex={state.brush.startIndex}
                            endIndex={state.brush.endIndex}
                            x={0}
                            y={10}
                            width={900}
                            height={30}
                            data={state.brush.data}
                            onChange={handleBrushUpdate}
                            tickFormatter={(index) => state.brush.data[index]}
                        >
                            <CartesianAxis
                                orientation='top'
                                minTickGap={40}
                                viewBox={{ x: 0, y: 0, width: 900, height: 30 }}
                                ticks={getBrushTicks}
                            />
                        </Brush>
                    </Surface>
                </Menu.Item>
                <Menu.Item position='right'>
                    <Icon size='big' name='help circle'/>
                </Menu.Item>
            </Menu>
            {state.dataset.length !== 0 && !state.pending ?
                selectedYears.year1 === selectedYears.year2 ?
                    <YearView 
                        dataRows={state.dataset.filter(row => row.year === selectedYears.year1)} 
                        detailRow={state.detailRow} 
                        detailView={state.detailView}
                        dispatch={dispatch}
                    />
                : <label>range</label>
            :
                <div style={{width: '100%', marginTop: '100px', textAlign: 'center'}}> 
                    <Label>Please select a dataset</Label>
                </div>
            }
        </>
    )
}

/*
{state.pending ? (
                    <div style={{marginTop: '8px', marginLeft: '8px'}}>
                        <Loader active inline size='small' />
                    </div>)
                : ''}
*/

/*
<AwardTable 
                            dataRows={dataState.filter(row => row.year === '2020')}
                            showPersonDetail={showPersonDetail}
                            showWorkDetail={showWorkDetail}
                        />
*/

/*
<ForceGraph2D
                            graphData={
                                {
                                    "nodes": [
                                        { 'id': '2020' },
                                        ...categories.map(category => { return { 'id': category} }),
                                        ...persons.map(person => { return {'id': person}})
                                    ],
                                    "links": [
                                        ...categories.map(category => { return { 'source': '2020', 'target': category }}),
                                        ...personLinks
                                    ]
                                }
                            }
                            nodeLabel="id"
                            nodeAutoColorBy='group'
                            nodeCanvasObject={(node, ctx, globalScale) => {
                                const fontSize = 12/globalScale;
                                ctx.font = `${fontSize}px Sans-Serif`;
                                ctx.textAlign = 'center'
                                ctx.textBaseline = 'middle'
                                ctx.fillText('' + node.id, node.x || 0, node.y || 0)
                            }}
                        />,
*/

/*
<Surface width={800} height={200}>
                <Brush
                    startIndex={brushState.startIndex}
                    endIndex={brushState.endIndex}
                    x={100}
                    y={50}
                    width={400}
                    height={40}
                    data={uniqueYears}
                    onChange={updateBrush}
                    tickFormatter={(index) => uniqueYears[index]}
                />
            </Surface>
*/