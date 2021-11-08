import Layout from "../components/Layout/Layout";
import SearchInput from "../components/SearchInput/SearchInput";
import CountriesTable from "../components/CountriesTable/CountriesTable";
import styles from "../styles/Home.module.css";
import { useState } from "react";

export default function Home({ countries }) {
  const [keyword, setKeyword] = useState("");

  const filterCountries = countries.filter(
    (country) =>
      country.name.toLowerCase().includes(keyword) ||
      country.region.toLowerCase().includes(keyword)
  );

  const onInputChange = (event) => {
    event.preventDefault();
    setKeyword(event.target.value.toLowerCase());
  };

  return (
    <Layout>
      <div className={styles.input_container}>
        <div className={styles.counts}>Found {countries.length} countries</div>
        <SearchInput
          placeholder="Filter by name, region or subregion"
          onChange={onInputChange}
        />
      </div>

      <CountriesTable countries={filterCountries} />
    </Layout>
  );
}

export const getStaticProps = async () => {
  const res = await fetch("https://restcountries.com/v2/all");
  const countries = await res.json();

  return {
    props: {
      countries,
    },
  };
};
