import React, {useState, useEffect} from "react"
import {
  ComposableMap,
  Geographies,
  Geography,
  Sphere,
  Graticule
} from "react-simple-maps"
import { scaleLinear } from "d3-scale"
import { groupBy } from "../../../utils/groupBy";
import { Header } from 'semantic-ui-react'

const geoUrl =
  "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

export default function Choropleth({dataRows}) {
  const [choropleth, setChoropleth] = useState()
  const [hoverText, setHoverText] = useState('<hover country for detailed information>')

  useEffect(() => {
    const birthplaces = dataRows.map(row => {
      return {
        value: row['p:birthplace']
          .substring((row['p:birthplace'].includes(',') ? 
            row['p:birthplace'].lastIndexOf(',') 
            : row['p:birthplace'].lastIndexOf('-')
          ) + 1)
          .replace('[', '')
          .replace(']', '')
          .replace('(', '')
          .replace(')', '')
          .replace('-', '')
          .replace('U.S.', 'USA')
          .replace('U.S', 'USA')
          .replace('USAA', 'USA')
          .replace('USA.', 'USA')
          .replace('USAA.', 'USA')
          .replace('United States', 'USA')
          .replace('Illinois', 'USA')
          .replace('New York', 'USA')
          .replace('Stati Uniti', 'USA')
          .replace('Japão', 'Japan')
          .replace('Czechoslovakia', 'Czech Republic')
          .replace('U.K.', 'GB')
          .replace('England UK', 'GB')
          .replace('United Kingdom', 'GB')
          .replace('England', 'GB')
          .replace('Russian Empire', 'Russia')
          .replace('Russian Empire now Belarus', 'Belarus')
          .replace('Russia now Belarus', 'Belarus')
          .replace('Russia now Poland', 'Ukraine')
          .replace('Russia now Ukraine', 'Ukraine')
          .replace('Russia now Russia', 'Russia')
          .replace('USSR', 'Russia')
          .replace('USSR now Russia', 'Russia')
          .replace('Austria-Hungary now Austria', 'Austria')
          .replace('Austria-Hungary', 'Austria')
          .replace('Austria-Hungary now Poland', 'Poland')
          .replace('Austria now Poland', 'Poland')
          .replace('Austria now Hungary', 'Hungary')
          .replace('French Cochinchina. now Vietnam', 'Vietnam')
          .replace('France now Algeria', 'Algeria')
          .replace('España', 'Spain')
          .replace('Égypte', 'Egypt')
          .replace('Messico', 'Mexico')
          .replace('Czechoslovakia now Czech Republic', 'Czech Republic')
          .replace('British Guiana now Guyana', 'Guyana')
          .replace('the Netherlands', 'Netherlands')
          .replace('Romania now Moldova', 'Moldova')
          .replace('Ottoman Empire', 'Turkey')
          .replace('Yugoslavia now Serbia and Montenegro', 'Serbia')
          .trim()
      }
    })
    const groupedBirthplaces = groupBy(birthplaces, 'value')
    delete groupedBirthplaces[''] // remove root category with no name
    const birthplaceData = Object.keys(groupedBirthplaces).map(country => {
      return { name: country, val: groupedBirthplaces[country].length }
    })

    const min = birthplaceData.length > 0 ? birthplaceData.reduce((p, v) => p.val < v.val ? p : v).val : 0
    
    const customScale = scaleLinear()
      .domain([min, min + 50])
      .range(["#ffedea", "red"]);

    setChoropleth(<ComposableMap
      projectionConfig={{
        rotate: [-10, 0, 0],
        scale: 120,
      }}
      height={350}
    >
      <Sphere stroke="#E4E5E6" strokeWidth={0.5} />
      <Graticule stroke="#E4E5E6" strokeWidth={0.5} />
      {birthplaceData.length > 0 && (
        <Geographies geography={geoUrl}>
          {({ geographies, proj }) =>
            geographies.map((geo, i) => {
              const d = birthplaceData.find(birthplace => {
                return birthplace.name === geo.properties.ISO_A3
                  || birthplace.name === geo.properties.ISO_A2
                  || birthplace.name === geo.properties.NAME
                  || birthplace.name === geo.properties.NAME_LONG
                  || birthplace.name === geo.properties.ABBREV
              })
              return (
                <Geography
                  key={geo.properties.ISO_A3 + i}
                  geography={ geo }
                  projection={ proj }
                  style={{
                    default: {
                      fill: d ? customScale(d.val) : "#ECEFF1",
                      stroke: "#FFF",
                      strokeWidth: 0.75,
                      outline: "none",
                    }
                  }}
                  onMouseEnter={() => {
                    setHoverText(d ? `${d.name}: ${d.val}` : '<hover country for detailed information>')
                  }}
                />
              )
            })
          }
        </Geographies>
      )}
    </ComposableMap>)
  }, [dataRows])

  return (
    <>
      <Header>Nominee Origins</Header>
      <p>{hoverText}</p>
      {choropleth}
    </>
  );
}
