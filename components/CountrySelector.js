
import { useState } from 'react';
import useStats from '../utils/useStats';
import Stats from './Stats';


export default function CountrySelector() {

  const { stats: countries, loading, error } = useStats(
    'https://covid19.mathdro.id/api/countries'
  );

  console.log(countries);
  //console.log(countries.iso3);
  const [selectedCountry, setSelectedCountry] = useState('USA');
  if (loading) return <p>Loading...</p>;
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error...</p>;

//Cannot read property of object In countrySelector.
//" selected={selectedCountry === countries.iso3[code]} "
  let oldStructure = {
    countries: {},
    iso3: {}
    };

    for (let country of countries.countries) {
      oldStructure.countries[country.name] = country.iso2;
      oldStructure.iso3[country.iso2] = country.iso3;
      // console.log(typeof(oldStructure.iso3[country.iso2]));
    }

return (
    <div>
      <h2>Currently Showing {selectedCountry}</h2>
      <select
        onChange={e => {
          setSelectedCountry(e.target.value);
          console.log(typeof(e.target.value));
        }}
      >
        {/* Object.entries creates an array of arrays */}
        {/* {Object.entries(countries.countries).map(([country, code]) => (
          <option
            selected={selectedCountry === countries.iso3[code]}
            key={code}
            value={countries.iso3[code]}
          >
            {country}
          </option>
        ))} */}
        {Object.entries(oldStructure.countries).map(([country, code]) => (
          <option
            selected={selectedCountry === oldStructure.iso3[code]}
            key={code}
            value={oldStructure.iso3[code]}
          >
            {country}
          </option>
        ))}
      </select>
      <Stats
        url={`https://covid19.mathdro.id/api/countries/${selectedCountry}`}
      ></Stats>
    </div>
  );
}
