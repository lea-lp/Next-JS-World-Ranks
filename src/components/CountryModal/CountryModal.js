import { useState, useEffect } from "react";
import ReactDom from "react-dom";
import styles from "./CountryModal.module.css";

const getCountry = async (id) => {
  const res = await fetch(`https://restcountries.com/v2/alpha/${id}`);
  const country = await res.json();

  return country;
};

export default function CountryModal({ country, onClose, setOpenModal }) {
  const [clickableCountry, setClickableCountry] = useState(false);

  const [borders, setBorders] = useState([]);

  const getBorders = async () => {
    const borders =
      country.borders && country.borders.length
        ? await Promise.all(country.borders.map((border) => getCountry(border)))
        : [];
    setBorders(borders);
  };

  useEffect(() => {
    getBorders();
  }, [country]);

  return ReactDom.createPortal(
    <div
      className={styles.modal}
      onClick={() => !clickableCountry && onClose()}
    >
      <div className={styles.container}>
        {/* ........... CONTAINER TOP : .overview_panel ........... */}
        {/* ..... Main infos ..... */}
        <div className={styles.overview_panel}>
          {/* Flag */}
          <img src={country.flag} alt={country.name}></img>
          {/* Name */}
          <h1 className={styles.overview_name}>{country.name}</h1>
          {/* Region */}
          <div className={styles.overview_region}>{country.region}</div>

          {/* ..... Numbers ..... */}
          <div className={styles.overview_numbers}>
            {/* Population */}
            <div className={styles.overview_population}>
              <div className={styles.overview_label}>Population</div>
              <div className={styles.overview_value}>{country.population}</div>
            </div>

            {/* Area */}
            <div className={styles.overview_area}>
              <div className={styles.overview_label}>Area</div>
              <div className={styles.overview_value}>{country.area}</div>
            </div>
          </div>
        </div>

        {/* ........... CONTAINER BOTTOM : .details_panel ........... */}
        <div className={styles.details_panel}>
          {/* Capital */}
          <div className={styles.details_panel_row}>
            <div className={styles.details_panel_label}>Capital</div>
            <div className={styles.details_panel_value}>{country.capital}</div>
          </div>

          {/* Subregion */}
          <div className={styles.details_panel_row}>
            <div className={styles.details_panel_label}>Subregion</div>
            <div className={styles.details_panel_value}>
              {country.subregion}
            </div>
          </div>

          {/* Languages */}
          {country.languages && country.languages.length && (
            <div className={styles.details_panel_row}>
              <div className={styles.details_panel_label}>Languages</div>
              <div className={styles.details_panel_value}>
                {country.languages.map(({ name }) => name).join(", ")}
              </div>
            </div>
          )}

          {/* Currencies */}
          {country.currencies && country.currencies.length && (
            <div className={styles.details_panel_row}>
              <div className={styles.details_panel_label}>Currencies</div>
              <div className={styles.details_panel_value}>
                {country.currencies.map(({ name }) => name).join(", ")}
              </div>
            </div>
          )}

          {/* Native name */}
          <div className={styles.details_panel_row}>
            <div className={styles.details_panel_label}>Native name</div>
            <div className={styles.details_panel_value}>
              {country.nativeName}
            </div>
          </div>

          {/* Neighbouring countries */}
          {country.borders && country.borders.length && (
            <div className={styles.details_panel_borders}>
              <div className={styles.details_panel_borders_label}>
                Neighbouring countries
              </div>

              <div className={styles.details_panel_borders_container}>
                {borders.map(({ flag, name }) => (
                  <div
                    key={name}
                    className={styles.details_panel_borders_country}
                    onClick={() => setOpenModal(name)}
                    onMouseEnter={() =>
                      !clickableCountry && setClickableCountry(true)
                    }
                    onMouseLeave={() =>
                      clickableCountry && setClickableCountry(false)
                    }
                  >
                    <img src={flag} alt={name}></img>
                    <div className={styles.details_panel_borders_name}>
                      {name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.getElementById("modal-portal")
  );
}
