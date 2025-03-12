import CountryListItem from './CountryListItem';

const Countries = ({ countriesToShow }) => {
  return (
    <div>
      {countriesToShow.map(countryName => {
        return <CountryListItem key={countryName} name={countryName} />;
      })}
    </div>
  );
}

export default Countries;
