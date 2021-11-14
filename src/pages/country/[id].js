import { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import styles from "./Country.module.css";
import Link from "next/link";

const getCountry = async (id) => {
  const res = await fetch(`https://restcountries.com/v3.1/alpha/${id}`);
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
  }, [country]);

  return (
    <Layout title={country.name.common}>
      <div className={styles.container}>
        {/* ........... CONTAINER LEFT : .overview_panel ........... */}
        <div className={styles.container_left}>
          {/* ..... Main infos ..... */}
          <div className={styles.overview_panel}>
            {/* Flag */}
            <img src={country.flags.svg} alt={country.name.common}></img>
            {/* Name */}
            <h1 className={styles.overview_name}>{country.name.common}</h1>
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

            {/* Official name */}
            <div className={styles.details_panel_row}>
              <div className={styles.details_panel_label}>Official name</div>
              <div className={styles.details_panel_value}>
                {country.name.official}
              </div>
            </div>

            {/* Neighbouring countries */}
            {country.borders && country.borders.length && (
              <div className={styles.details_panel_borders}>
                <div className={styles.details_panel_borders_label}>
                  Neighbouring countries
                </div>

                <div className={styles.details_panel_borders_container}>
                  {borders.map(({ flags, name, alpha3Code }) => (
                    <Link key={name.common} href={`/country/${alpha3Code}`}>
                      <a>
                        <div className={styles.details_panel_borders_country}>
                          <img src={flags.svg} alt={name.common}></img>
                          <div className={styles.details_panel_borders_name}>
                            {name.common}
                          </div>
                        </div>
                      </a>
                    </Link>
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
  const res = await fetch("https://restcountries.com/v3.1/all");
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
