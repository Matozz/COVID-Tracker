import React, { useState, useEffect } from "react";
import {
  FormControl,
  Select,
  MenuItem,
  Card,
  CardContent,
} from "@material-ui/core";
import InfoBox from "./components/InfoBox/InfoBox";
import Map from "./components/Map/Map";
import Table from "./components/Table/Table";
import { sortData, prettyPrintStat, prettyPrintNum } from "./util/util";
import LineGraph from "./components/LineGraph/LineGraph";

import "./App.css";
import "leaflet/dist/leaflet.css";

function App() {
  //STATE = how to write a variable in REACT <<<<<
  //data from
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);

  //useEFFECT = run a piece of code based on a given condition
  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  useEffect(() => {
    //normal -> code inside run once, when the conponent(countries) loads and changes //[] run when load
    //async -> send request and wait, then do
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));

          const sortedData = sortData(data);
          setTableData(sortedData);
          setMapCountries(data);
          setCountries(countries);
        });
    };
    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);

        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      });
    //https://disease.sh/v3/covid-19/all
    //https://disease.sh/v3/covid-19/countries/[COUNTRY_CODE]
  };
  console.log(countryInfo);

  return (
    <div className="app">
      {/* Header */}
      {/* Title + Select input */}
      <div className="app_left">
        <div className="app_header">
          <h1 className="app_headerTitle">
            COVID-19 Tracker
            <span role="img" aria-label="emm..">
              🤔
            </span>
          </h1>
          <FormControl className="app_dropDown">
            <Select
              variant="outlined"
              onChange={onCountryChange}
              value={country}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        {/* InfoBoxs cases */}
        {/* InfoBoxs recoveries*/}
        {/* InfoBoxs */}
        <div className="app_stats">
          <InfoBox
            onClick={(e) => setCasesType("cases")}
            active={casesType === "cases"}
            title="Confirmed"
            isOrange
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={prettyPrintNum(countryInfo.cases)}
          />
          <InfoBox
            onClick={(e) => setCasesType("recovered")}
            active={casesType === "recovered"}
            title="Recovered"
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={prettyPrintNum(countryInfo.recovered)}
          />
          <InfoBox
            onClick={(e) => setCasesType("deaths")}
            active={casesType === "deaths"}
            title="Deaths"
            isRed
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={prettyPrintNum(countryInfo.deaths)}
          />
        </div>

        {/* Map */}
        <Map
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}
          casesType={casesType}
        />
      </div>
      <Card className="app_right">
        <CardContent>
          <div className="app_information">
            <h3>Live Cases by Countries</h3>
            <Table countries={tableData} />
            <h3>Worldwide new {casesType}</h3>
            <LineGraph className="app_graph" casesType={casesType} />
          </div>
        </CardContent>
        {/* Table */}
        {/* Graph */}
      </Card>
    </div>
  );
}

export default App;
