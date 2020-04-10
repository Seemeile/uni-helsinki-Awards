import React, { useState, useCallback } from 'react'
import { LineChart, XAxis, CartesianGrid, Line, Tooltip } from 'recharts'
import { Dropdown, Menu, Loader } from 'semantic-ui-react'
import Papa from 'papaparse'

type dataRow = {
    year: string,
    category: string,
    winner: string,
    name: string,
    work: string,
    'p:gender': string,
    'p:birthday': string,
    'p:birthplace': string,
    'p:deathday': string,
    'p:popularity': string,
    'p:biography': string,
    'p:knownForDepartment': string,
    'p:profilePath': string,
    'w:posterPath': string,
    'w:genreIds': string,
    'w:popularity': string,
    'w:overview': string
}

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

const readCSVData = async (filename: string): Promise<dataRow[]> => {
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

export default function Dashboard() {
    const [pending, setPending] = useState(false)
    const [dataState, setDataState] = useState([{}])

    const handleDatasetOscarAwardClick = useCallback(async () => {
        setPending(true)
        const results: dataRow[] = await readCSVData('the_oscar_award.csv')
        const year1928: dataRow[] = results.filter(row => row.year === '1928') // TEST
        setDataState(year1928)
        setPending(false)
    }, [setDataState])

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
            <LineChart
                width={1200}
                height={400}
                data={dataState}
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
                <XAxis dataKey="name" />
                <Tooltip />
                <CartesianGrid stroke="#f5f5f5" />
                <Line type="monotone" dataKey="p:birthday" stroke="#ff7300" yAxisId={0} />
            </LineChart>
        </>
    )
}
