import React, { useState, useCallback, useEffect, useMemo, useReducer } from 'react'
import { LineChart, XAxis, CartesianGrid, Line, Tooltip, Brush, Surface, ComposedChart, Bar } from 'recharts'
import { Dropdown, Menu, Loader, Table, Label, Header, Image, PlaceholderParagraph, Placeholder } from 'semantic-ui-react'
import Papa from 'papaparse'
import AwardTable from './AwardTable'
import { DataRow } from '../types/Types'
import PersonDetail from './PersonDetail'
import WorkDetail from './WorkDetail'

const data = [
    { name: 'Page A', uv: 1000, pv: 2400, amt: 2400, uvError: [75, 20] },
    { name: 'Page B', uv: 300, pv: 4567, amt: 2400, uvError: [90, 40] },
    { name: 'Page C', uv: 280, pv: 1398, amt: 2400, uvError: 40 },
    { name: 'Page D', uv: 200, pv: 9800, amt: 2400, uvError: 20 },
    { name: 'Page E', uv: 278, pv: null, amt: 2400, uvError: 28 },
    { name: 'Page F', uv: 189, pv: 4800, amt: 2400, uvError: [90, 20] },
    { name: 'Page G', uv: 189, pv: 4800, amt: 2400, uvError: [28, 40] },
    { name: 'Page H', uv: 189, pv: 4800, amt: 2400, uvError: 28 },
    { name: 'Page I', uv: 189, pv: 4800, amt: 2400, uvError: 28 },
    { name: 'Page J', uv: 189, pv: 4800, amt: 2400, uvError: [15, 60] },
  ];

const readCSVData = async (filename: string): Promise<DataRow[]> => {
    return new Promise((resolve, reject) => {
        try {
            const githubBase = 'https://raw.githubusercontent.com/Seemeile/uni-helsinki-prj_awards/master/src/data/'
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
        detailView: 'person'
    }
}

type ReducerStateProps = {
    detailRow: DataRow
    detailView: 'person' | 'work'
}

type ReducerActionProps = {
    type: 'setDetail'
    payload: { detailRow: DataRow, detailView: 'person' | 'work' }
}

const reducer = (state: ReducerStateProps, action: ReducerActionProps) => {
    switch (action.type) {
        case 'setDetail':
            return { ...state, detailRow: action.payload.detailRow, detailView: action.payload.detailView }
        default:
            return state
    }
}

export default function Dashboard() {
    const initialData: DataRow[] = []
    const [pending, setPending] = useState(false)
    const [dataState, setDataState] = useState(initialData)
    const [brushState, setBrushState] = useState({startIndex: 0, endIndex: 0})
    
    const [state, dispatch] = useReducer(reducer, createInitialState())

    const uniqueYears = useMemo(() => {
        return Array.from(new Set(dataState.map((row: DataRow) => row.year)))
    }, [dataState])

    const handleDatasetOscarAwardClick = useCallback(async () => {
        setPending(true)
        const results: DataRow[] = await readCSVData('the_oscar_award.csv')
        //const year1928: dataRow[] = results.filter(row => row.year === '1928' || row.year === '1929' || row.year === '1930') // TEST
        setDataState(results)
        setPending(false)
    }, [setDataState])

    const updateBrush = useCallback((newState) => {
        setBrushState(newState)
    }, [])

    useEffect(() => {
        if (uniqueYears && uniqueYears.length) {
            updateBrush({startIndex: 0, endIndex: uniqueYears.length - 1})
        }
    }, [uniqueYears, dataState, updateBrush])

    const showPersonDetail = useCallback((row: DataRow) => {
        dispatch({ type: 'setDetail', payload: {detailRow: row, detailView: 'person'} })
    }, [dispatch])

    const showWorkDetail = useCallback((row: DataRow) => {
        dispatch({ type: 'setDetail', payload: {detailRow: row, detailView: 'work'} })
    }, [dispatch])

    return (
        <>
            <Menu attached='top'>
                <Dropdown item icon='wrench' simple text='datasets'>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={handleDatasetOscarAwardClick}>Oscar Awards 1928 - 2020</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                {pending ? (
                    <div style={{marginTop: '8px', marginLeft: '8px'}}>
                        <Loader active inline size='small' />
                    </div>)
                : ''}
                <Menu.Menu position='right'>
                    <div className='ui right aligned category search item'>
                    <div className='ui transparent icon input'>
                        <input
                        className='prompt'
                        type='text'
                        placeholder='Search animals...'
                        />
                        <i className='search link icon' />
                    </div>
                    <div className='results' />
                    </div>
                </Menu.Menu>
            </Menu>
            {dataState.length !== 0 ?
                <div style={{width: '90%', marginLeft: '5%', marginTop: '10px', display: 'flex', flexDirection: 'row'}}>
                    <div style={{width: '80%'}}>
                        <AwardTable 
                            dataRows={dataState.filter(row => row.year === '2020')}
                            showPersonDetail={showPersonDetail}
                            showWorkDetail={showWorkDetail}
                        />
                    </div>
                    <div style={{width: '20%', marginLeft: '10px'}}>
                        {state.detailView === 'person' ?
                            <PersonDetail dataRow={state.detailRow}/>
                            :
                            <WorkDetail dataRow={state.detailRow}/>
                        }
                    </div>
                </div>
            :
                <div style={{width: '100%', marginTop: '100px', textAlign: 'center'}}> 
                    <label>Please select a dataset</label>
                </div>
            }
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
        </>
    )
}
