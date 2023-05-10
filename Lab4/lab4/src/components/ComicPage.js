import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
const md5 = require("blueimp-md5");
const publickey = "be40b7bd3ff63bcee0170359b0eee0f1";
const privatekey = "81d9dee35854024bac936976cbf6a114ab80a20e";
const ts = new Date().getTime();
const stringToHash = ts + privatekey + publickey;
const hash = md5(stringToHash);
const baseUrl = "https://gateway.marvel.com:443/v1/public/comics/";

const ComicPage = () => {
  let displayData = undefined;
  const [comicData, setComicData] = useState(undefined);
  const [notFound, setNotFound] = useState(false);
  let { id } = useParams();

  useEffect(() => {
    async function getComicData() {
      try {
        const url =
          baseUrl + id + "?ts=" + ts + "&apikey=" + publickey + "&hash=" + hash;
        const { data } = await axios.get(url);
        setComicData(data.data.results[0]);
      } catch (e) {
        setNotFound(true);
      }
    }
    getComicData();
  }, [id]);

  const otherLinks = (link) => {
    let key = comicData.name + link.type;
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
      comicData.thumbnail.path + "." + comicData.thumbnail.extension;
    let description = null;
    if (!comicData.description || comicData.description.length === 0) {
      description = "No description available";
    } else {
      description = comicData.description;
    }
    let isbn = null;
    if (comicData.isbn.length === 0) {
      isbn = "ISBN not available";
    } else {
      isbn = comicData.isbn;
    }
    let pageCount = null;
    if (comicData.pageCount === 0) {
      pageCount = "Page count not available";
    } else {
      pageCount = comicData.pageCount;
    }
    return (
      <div>
        <h1 className="charTitle">{comicData.title}</h1>
        <img
          className="largeCharImage"
          src={imagePath}
          alt={comicData.title}
        ></img>
        <h2 className="desc">{description}</h2>
        <h3>Creators:</h3>
        <ul>
          {comicData.creators.items.map((creator) => {
            return <li key={creator.name}>{creator.name}</li>;
          })}
        </ul>
        <h3>Format: {comicData.format}</h3>
        <h3>ISBN: {isbn}</h3>
        <h3>Page Count: {pageCount}</h3>
        <h3>Related Links</h3>
        <ul>
          {comicData.urls.map((link) => {
            return otherLinks(link);
          })}
        </ul>
      </div>
    );
  };

  console.log(comicData);
  if (notFound) {
    displayData = <h2>Error 404 Not found</h2>;
  } else {
    displayData = comicData && buildPage();
  }

  return <div>{displayData}</div>;
};

export default ComicPage;
