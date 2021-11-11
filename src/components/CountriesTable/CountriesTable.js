/* eslint-disable @next/next/no-img-element */

import { Fragment, useState } from "react";

// import Link from "next/link";

import CountryModal from "../CountryModal/CountryModal";

import {
  KeyboardArrowDownRounded,
  KeyboardArrowUpRounded,
} from "@material-ui/icons";

import styles from "./CountriesTable.module.css";

const orderBy = (countries, value, direction) => {
  if (direction === "asc") {
    return [...countries].sort((a, b) => (a[value] > b[value] ? 1 : -1));
  }

  if (direction === "desc") {
    return [...countries].sort((a, b) => (a[value] > b[value] ? -1 : 1));
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
        <div className={styles.heading_flag}></div>

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
          className={styles.heading_currencies}
          onClick={() => setValueAndDirection("currencies")}
        >
          <div>Currency</div>

          {value === "currencies" && <SortArrow direction={direction} />}
        </button>
      </div>

      {orderedCountries.map((country) => (
        <Fragment key={country.name}>
          {/* <Link key={country.name} href={`/country/${country.alpha3Code}`}> */}
          {/* <a> */}
          <div
            onClick={() => setOpenModal(country.name)}
            className={styles.row}
          >
            <div className={styles.flag}>
              <img src={country.flag} alt={country.name}></img>
            </div>
            <div className={styles.name}>{country.name}</div>
            <div className={styles.population}>{country.population}</div>
            <div className={styles.area}>{country.area || 0}</div>
            <div className={styles.currencies}>
              {country.currencies && country.currencies.length
                ? `${country.currencies[0].code} (${country.currencies[0].symbol})`
                : ""}
            </div>
          </div>
          {/* </a> */}
          {/* </Link> */}
        </Fragment>
      ))}

      {openModal && (
        <CountryModal
          country={countries.find((c) => c.name === openModal)}
          onClose={() => setOpenModal(false)}
          setOpenModal={setOpenModal}
        />
      )}
    </div>
  );
};

export default CountriesTable;
