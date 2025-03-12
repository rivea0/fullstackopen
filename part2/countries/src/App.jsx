import { useEffect, useState } from 'react';
import countriesService from './services/countries';
import Input from './components/Input';
import Content from './components/Content';

const App = () => {
  const [countries, setCountries] = useState(null);
  const [country, setCountry] = useState(null);
  const [inputText, setInputText] = useState('');
  const [countryNames, setCountryNames] = useState(null);
  const [info, setInfo] = useState(null);

  useEffect(() => {
    if (!countryNames) {
      countriesService
      .getAll()
      .then(allCountries => {
        setCountryNames(allCountries.map(country => country.name.common));
      })
      .catch(error => {
        console.log('Could not get all countries');
      });
    } else {
      zeroCountriesMatch();
      let matchedCountries = [];
      countryNames.forEach(countryName => {
        if (inputText && isSubstring(inputText, countryName)) {
          matchedCountries.push(countryName);
        }
      });
      if (matchedCountries.length > 10) {
        tooManyCountriesMatch();
      } else if (matchedCountries.length <= 10 && matchedCountries.length > 1) {
        multipleCountriesMatch(matchedCountries);
      } else if (matchedCountries.length === 1) {
        countriesService
          .getCountry(matchedCountries[0].toLowerCase())
          .then(returnedCountry => {
            oneCountryMatch(returnedCountry);
          })
          .catch(error => {
            console.log('Could not get country data');
          });
      }
    }
  }, [inputText, countryNames]);

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  }

  const isSubstring = (str, strToSearch) => {
    return strToSearch.toLowerCase().includes(str.toLowerCase());
  }

  const zeroCountriesMatch = () => {
    setInfo(null);
    setCountries(null);
    setCountry(null);
  }

  const oneCountryMatch = (returnedCountry) => {
    setCountry(returnedCountry);
    setCountries(null);
    setInfo(null);
  }

  const multipleCountriesMatch = (matchedCountries) => {
    setCountries(matchedCountries);
    setCountry(null);
    setInfo(null);
  }

  const tooManyCountriesMatch = () => {
    setInfo('Too many matches, specify another filter');
    setCountries(null);
    setCountry(null);
  }

  if (!countryNames) {
    return <p>Getting countries data... This might take a while.</p>;
  }

  return (
    <div>
      <Input inputText={inputText} handleInputChange={handleInputChange} />
      {inputText && <Content info={info} countries={countries} country={country} />}
    </div>
  );
}

export default App;
