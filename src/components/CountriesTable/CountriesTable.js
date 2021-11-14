import { Fragment, useState } from "react";

// import Link from "next/link";

import CountryModal from "../CountryModal/CountryModal";

import {
  KeyboardArrowDownRounded,
  KeyboardArrowUpRounded,
} from "@material-ui/icons";

import styles from "./CountriesTable.module.css";

const getGiniValue = (country) => country.gini[Object.keys(country.gini)[0]];

const sortByValue = (a, b, value, direction) => {
  const up = direction === "asc" ? 1 : -1;
  const down = direction === "asc" ? -1 : 1;

  if (value === "gini") return getGiniValue(a) > getGiniValue(b) ? up : down;
  if (value === "name") return a.name.common > b.name.common ? up : down;
  return a[value] > b[value] ? up : down;
};

const orderBy = (countries, value, direction) => {
  if (direction) {
    return [...countries]
      .filter((i) => i[value])
      .sort((a, b) => sortByValue(a, b, value, direction));
  }

  return countries;
};

const SortArrow = ({ direction }) => {
  if (!direction) {
    return <></>;
  }

  if (direction === "desc") {
    return (
      <div className={styles.heading_arrow}>
        <KeyboardArrowDownRounded color="inherit" />
      </div>
    );
  } else {
    return (
      <div className={styles.heading_arrow}>
        <KeyboardArrowUpRounded color="inherit" />
      </div>
    );
  }
};

const CountriesTable = ({ countries }) => {
  const [direction, setDirection] = useState();
  const [value, setValue] = useState();
  const [openModal, setOpenModal] = useState(false);

  const orderedCountries = orderBy(countries, value, direction);

  const switchDirection = () => {
    if (!direction) {
      setDirection("desc");
    } else if (direction === "desc") {
      setDirection("asc");
    } else {
      setDirection(null);
    }
  };

  const setValueAndDirection = (value) => {
    switchDirection();
    setValue(value);
  };

  return (
    <div>
      <div className={styles.heading}>
        <button
          className={styles.heading_name}
          onClick={() => setValueAndDirection("name")}
        >
          <div>Name</div>

          {value === "name" && <SortArrow direction={direction} />}
        </button>

        <button
          className={styles.heading_population}
          onClick={() => setValueAndDirection("population")}
        >
          <div>Population</div>

          {value === "population" && <SortArrow direction={direction} />}
        </button>

        <button
          className={styles.heading_area}
          onClick={() => setValueAndDirection("area")}
        >
          <div>
            Area (km<sup style={{ fontSize: "0.5rem" }}>2</sup>)
          </div>

          {value === "area" && <SortArrow direction={direction} />}
        </button>

        <button
          className={styles.heading_gini}
          onClick={() => setValueAndDirection("gini")}
        >
          <div>Gini</div>

          {value === "gini" && <SortArrow direction={direction} />}
        </button>
      </div>

      {orderedCountries.map((country) => (
        <Fragment key={country.name.common}>
          {/* <Link key={country.name.common} href={`/country/${country.alpha3Code}`}> */}
          {/* <a> */}
          <div
            onClick={() => setOpenModal(country.name.common)}
            className={styles.row}
          >
            <div className={styles.name}>
              <div className={styles.flag}>{country.flag}</div>
              {country.name.common}
            </div>
            <div className={styles.population}>{country.population}</div>
            <div className={styles.area}>{country.area || 0}</div>
            <div className={styles.gini}>
              {country.gini ? (
                <>
                  <div className={styles.gini_bar}>
                    <div
                      className={styles.gini_bar_indicator}
                      style={{
                        width: getGiniValue(country),
                      }}
                    />
                  </div>
                  <div className={styles.gini_percent}>
                    {getGiniValue(country).toFixed()} % (
                    {Object.keys(country.gini)[0]})
                  </div>
                </>
              ) : (
                <div className={styles.gini_percent}>no data</div>
              )}
            </div>
          </div>
          {/* </a> */}
          {/* </Link> */}
        </Fragment>
      ))}

      {openModal && (
        <CountryModal
          country={countries.find((c) => c.name.common === openModal)}
          onClose={() => setOpenModal(false)}
          setOpenModal={setOpenModal}
        />
      )}
    </div>
  );
};

export default CountriesTable;
