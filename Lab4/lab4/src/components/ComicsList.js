import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
const md5 = require("blueimp-md5");
const publickey = "be40b7bd3ff63bcee0170359b0eee0f1";
const privatekey = "81d9dee35854024bac936976cbf6a114ab80a20e";
const ts = new Date().getTime();
const stringToHash = ts + privatekey + publickey;
const hash = md5(stringToHash);
const baseUrl = "https://gateway.marvel.com:443/v1/public/comics";
const url = baseUrl + "?ts=" + ts + "&apikey=" + publickey + "&hash=" + hash;

const ComicsList = () => {
  const [comicsData, setComicsData] = useState(undefined);
  const [notFound, setNotFound] = useState(false);
  let displayData = null;
  let { page } = useParams();
  let prevButton = null;
  const next = `/comics/page/${Number(page) + 1}`;
  const nextButton = (
    <Link to={next} className="pageButton">
      Next
    </Link>
  );

  useEffect(() => {
    async function getComicsData() {
      try {
        const getUrl = url + "&offset=" + page * 20;
        const { data } = await axios.get(getUrl);
        if (data.data.count === 0) {
          setNotFound(true);
        }
        setComicsData(data.data.results);
      } catch (e) {
        setNotFound(true);
      }
    }
    getComicsData();
  }, [page]);

  if (page != 0) {
    const previous = `/comics/page/${Number(page) - 1}`;
    prevButton = (
      <Link to={previous} className="pageButton">
        Previous
      </Link>
    );
  }

  const buildPage = () => {
    return (
      <div>
        <br></br>
        {prevButton}
        {nextButton}
        <ul className="list">
          {comicsData.map((comic) => {
            return buildComic(comic);
          })}
        </ul>
      </div>
    );
  };

  const buildComic = (comic) => {
    let imagePath = comic.thumbnail.path + "." + comic.thumbnail.extension;
    return (
      <li className="individualCharacter" key={comic.id}>
        <Link to={`/comics/${comic.id}`} className="listItem">
          <img
            className="smallCharImage"
            src={imagePath}
            alt={comic.title}
          ></img>
          <h2>{comic.title}</h2>
        </Link>
      </li>
    );
  };

  if (notFound) {
    displayData = <h2>Error 404 Not found</h2>;
  } else {
    displayData = comicsData && buildPage();
  }

  return <div>{displayData}</div>;
};

export default ComicsList;
