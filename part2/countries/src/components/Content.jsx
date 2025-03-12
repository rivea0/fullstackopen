import Countries from './Countries';
import Country from './Country';

const Content = ({ info, countries, country }) => {
  return (
    <div>
      <div>{info && <p>{info}</p>}</div>
      <div>{countries && <Countries countriesToShow={countries} />}</div>
      <div>
        {country && (
          <Country
            countryData={{
              name: country.name.common,
              capital: country.capital,
              area: country.area,
              languages: Object.values(country.languages),
              flagImgSrc: country.flags.png,
              flagImgAltText: country.flags.alt
            }} />
        )}
      </div>
    </div>
  );
}

export default Content;
