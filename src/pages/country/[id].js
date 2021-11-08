import { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import styles from "./Country.module.css";

const getCountry = async (id) => {
  const res = await fetch(`https://restcountries.com/v2/alpha/${id}`);
  const country = await res.json();

  return country;
};

const Country = ({ country }) => {
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
  }, []);

  return (
    <Layout title={country.name}>
      <div className={styles.container}>
        {/* ........... CONTAINER LEFT : .overview_panel ........... */}
        <div className={styles.container_left}>
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
                <div className={styles.overview_value}>
                  {country.population}
                </div>
              </div>

              {/* Area */}
              <div className={styles.overview_area}>
                <div className={styles.overview_label}>Area</div>
                <div className={styles.overview_value}>{country.area}</div>
              </div>
            </div>
          </div>
        </div>

        {/* ........... CONTAINER RIGHT : .details_panel ........... */}
        <div className={styles.container_right}>
          <div className={styles.details_panel}>
            {/* Heading */}
            <h4 className={styles.details_panel_heading}>Details</h4>

            {/* Capital */}
            <div className={styles.details_panel_row}>
              <div className={styles.details_panel_label}>Capital</div>
              <div className={styles.details_panel_value}>
                {country.capital}
              </div>
            </div>

            {/* Subregion */}
            <div className={styles.details_panel_row}>
              <div className={styles.details_panel_label}>Subregion</div>
              <div className={styles.details_panel_value}>
                {country.subregion}
              </div>
            </div>

            {/* Languages */}
            <div className={styles.details_panel_row}>
              <div className={styles.details_panel_label}>Languages</div>
              <div className={styles.details_panel_value}>
                {country.languages.map(({ name }) => name).join(", ")}
              </div>
            </div>

            {/* Currencies */}
            <div className={styles.details_panel_row}>
              <div className={styles.details_panel_label}>Currencies</div>
              <div className={styles.details_panel_value}>
                {country.currencies.map(({ name }) => name).join(", ")}
              </div>
            </div>

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
                      className={styles.details_panel_borders_country}
                      key={name}
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
      </div>
    </Layout>
  );
};

export default Country;

export const getStaticPaths = async () => {
  const res = await fetch("https://restcountries.com/v2/all");
  const countries = await res.json();

  const paths = countries.map((country) => ({
    params: { id: country.alpha3Code },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async ({ params }) => {
  const country = await getCountry(params.id);

  return {
    props: {
      ...params,
      country,
    },
  };
};
