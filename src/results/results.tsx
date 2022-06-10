import React, { useEffect, useState } from "react";
import { GithubAPI } from "../clients/github-client";
import { useSearch } from "../store/slices/search-slice";

let timer: any;

export const Results = () => {
  const { searchPhrase } = useSearch();
  const [results, setResults] = useState<{ login: string }[]>([]);
  const [totalResults, setTotalResults] = useState(0);

  const debounce = (callback: () => void, timeout: number) => {
    clearTimeout(timer);

    timer = setTimeout(() => {
      callback();
    }, timeout);
  };

  useEffect(() => {
    if (searchPhrase === "") {
      setResults([]);

      return;
    }

    const getResults = async () => {
      const response = await GithubAPI.get(`/search/users?q=${searchPhrase}`);
      console.log(response.data);

      setResults(response.data.items);

      setTotalResults(response.data.total_count);
    };

    debounce(() => getResults(), 1000);
  }, [searchPhrase]);

  return (
    <section className="w-full px-[140px] mx-auto flex flex-col">
      <div>{totalResults} Results</div>

      <ul className="w-[80%] min-h-[200px] flex flex-col gap-20">
        {results.map((result) => (
          <li>{result.login}</li>
        ))}
      </ul>
    </section>
  );
};
