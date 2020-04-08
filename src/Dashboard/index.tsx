import React from 'react'
import { LineChart, XAxis, CartesianGrid, Line, Tooltip } from 'recharts'
import { Dropdown, Icon, Menu, Segment } from 'semantic-ui-react'
import Papa from 'papaparse'
import axios from 'axios'

const {StringStream} = require("scramjet");
const request = require("request");

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

const readDataDSV = async (): Promise<any> => {
    return new Promise((resolve, reject) => {
        try {
            Papa.parse('https://github.com/Seemeile/uni-helsinki-prj_movieawards/raw/master/src/data/the_oscar_award.csv', {
                header: true,
                download: true,
                skipEmptyLines: true,
                error(error) {
                    reject(error)
                },
                complete(results) {
                    resolve(results)
                },
            })
        } catch (error) {
            reject(error)
        }
    })
}

const readCSV = async (): Promise<any> => {
    return axios.get("https://dog.ceo/api/breeds/list/all")
}

export default function Dashboard() {
    
    //readDataDSV().then(results => console.log(results))

    readCSV().then(res => console.log(res))

    //console.log(request.get("https://srv.example.com/main.csv"))
        //.pipe(new StringStream())                       // pass to stream
        //.CSVParse()                                   // parse into objects
        //.then(() => console.log("all done"))

    return (
        <>
            <Menu attached='top'>
                <Dropdown item icon='wrench' simple>
                    <Dropdown.Menu>
                    <Dropdown.Item>
                        <Icon name='dropdown' />
                        <span className='text'>New</span>

                        <Dropdown.Menu>
                        <Dropdown.Item>Document</Dropdown.Item>
                        <Dropdown.Item>Image</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown.Item>
                    <Dropdown.Item>Open</Dropdown.Item>
                    <Dropdown.Item>Save...</Dropdown.Item>
                    <Dropdown.Item>Edit Permissions</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Header>Export</Dropdown.Header>
                    <Dropdown.Item>Share</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>

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
                data={data}
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
                <XAxis dataKey="name" />
                <Tooltip />
                <CartesianGrid stroke="#f5f5f5" />
                <Line type="monotone" dataKey="uv" stroke="#ff7300" yAxisId={0} />
                <Line type="monotone" dataKey="pv" stroke="#387908" yAxisId={1} />
            </LineChart>
        </>
    )
}
