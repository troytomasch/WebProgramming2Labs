import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
const md5 = require("blueimp-md5");
const publickey = "be40b7bd3ff63bcee0170359b0eee0f1";
const privatekey = "81d9dee35854024bac936976cbf6a114ab80a20e";
const ts = new Date().getTime();
const stringToHash = ts + privatekey + publickey;
const hash = md5(stringToHash);
const baseUrl = "https://gateway.marvel.com:443/v1/public/characters/";

const CharacterPage = () => {
  let displayData = undefined;
  const [characterData, setCharacterData] = useState(undefined);
  const [notFound, setNotFound] = useState(false);
  let { id } = useParams();

  useEffect(() => {
    async function getCharacterData() {
      try {
        const url =
          baseUrl + id + "?ts=" + ts + "&apikey=" + publickey + "&hash=" + hash;
        const { data } = await axios.get(url);
        setCharacterData(data.data.results[0]);
      } catch (e) {
        setNotFound(true);
      }
    }
    getCharacterData();
  }, [id]);

  const otherLinks = (link) => {
    let key = characterData.name + link.type;
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
      characterData.thumbnail.path + "." + characterData.thumbnail.extension;
    let description = null;
    if (characterData.description.length === 0) {
      description = "No description available";
    } else {
      description = characterData.description;
    }
    return (
      <div>
        <h1 className="charTitle">{characterData.name}</h1>
        <img
          className="largeCharImage"
          src={imagePath}
          alt={characterData.name}
        ></img>
        <h2 className="desc">{description}</h2>
        <h3>Number of Comics: {characterData.comics.available}</h3>
        <h3>Number of Series: {characterData.series.available}</h3>
        <h3>Number of Stories: {characterData.stories.available}</h3>
        <h3>Related Links</h3>
        <ul>
          {characterData.urls.map((link) => {
            return otherLinks(link);
          })}
        </ul>
      </div>
    );
  };

  if (notFound) {
    displayData = <h2>Error 404 Not found</h2>;
  } else {
    displayData = characterData && buildPage();
  }

  return <div>{displayData}</div>;
};

export default CharacterPage;
