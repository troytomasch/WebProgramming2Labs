import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
const md5 = require("blueimp-md5");
const publickey = "be40b7bd3ff63bcee0170359b0eee0f1";
const privatekey = "81d9dee35854024bac936976cbf6a114ab80a20e";
const ts = new Date().getTime();
const stringToHash = ts + privatekey + publickey;
const hash = md5(stringToHash);
const baseUrl = "https://gateway.marvel.com:443/v1/public/series/";

const SeriesPage = () => {
  let displayData = undefined;
  const [seriesData, setSeriesData] = useState(undefined);
  const [notFound, setNotFound] = useState(false);
  let { id } = useParams();

  useEffect(() => {
    async function getSeriesData() {
      try {
        const url =
          baseUrl + id + "?ts=" + ts + "&apikey=" + publickey + "&hash=" + hash;
        const { data } = await axios.get(url);
        setSeriesData(data.data.results[0]);
      } catch (e) {
        setNotFound(true);
      }
    }
    getSeriesData();
  }, [id]);

  const otherLinks = (link) => {
    let key = seriesData.name + link.type;
    return (
      <li key={key}>
        <a href={link.url} target="_blank" rel="noreferrer">
          {link.type}
        </a>
      </li>
    );
  };

  const buildPage = () => {
    let imagePath =
      seriesData.thumbnail.path + "." + seriesData.thumbnail.extension;
    let description = null;
    if (!seriesData.description || seriesData.description.length === 0) {
      description = "No description available";
    } else {
      description = seriesData.description;
    }
    let rating = null;
    if (!seriesData.rating || seriesData.rating.length === 0) {
      rating = "No rating available";
    } else {
      rating = seriesData.rating;
    }
    return (
      <div>
        <h1 className="charTitle">{seriesData.title}</h1>
        <img
          className="largeCharImage"
          src={imagePath}
          alt={seriesData.title}
        ></img>
        <h2 className="desc">{description}</h2>
        <h3>
          {seriesData.startYear} - {seriesData.endYear}
        </h3>
        <h3>Creators:</h3>
        <ul>
          {seriesData.creators.items.map((creator) => {
            return <li key={creator.name}>{creator.name}</li>;
          })}
        </ul>
        <h3>Rating: {rating}</h3>
        <h3>Related Links</h3>
        <ul>
          {seriesData.urls.map((link) => {
            return otherLinks(link);
          })}
        </ul>
      </div>
    );
  };

  console.log(seriesData);
  if (notFound) {
    displayData = <h2>Error 404 Not found</h2>;
  } else {
    displayData = seriesData && buildPage();
  }

  return <div>{displayData}</div>;
};

export default SeriesPage;
