import React, { useState } from "react";
import List from "./List";
import { useQuery } from "@apollo/client";
import queries from "../queries";

function Home() {
  let returnData = null;
  let pageNum = 1;
  let { loading, error, data, fetchMore } = useQuery(
    queries.GET_UNSPLASH_PHOTOS,
    {
      variables: { pageNumber: pageNum },
    }
  );

  const buildList = () => {
    return <List data={data.unsplashImages}></List>;
  };

  if (data) {
    returnData = (
      <div>
        {buildList()}
        <button
          onClick={() => {
            pageNum++;
            fetchMore({
              variables: { pageNumber: pageNum },
            });
          }}
        >
          Get more images
        </button>
      </div>
    );
  } else if (loading) {
    returnData = <h2>Loading...</h2>;
  } else if (error) {
    returnData = <h2>{error}</h2>;
  }

  return returnData;
}

export default Home;
