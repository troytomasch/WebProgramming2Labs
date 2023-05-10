import React, { useState } from "react";
import List from "./List";
import { useQuery } from "@apollo/client";
import queries from "../queries";

function MyBin() {
  let returnData = null;
  let { loading, error, data } = useQuery(queries.GET_BINNED_IMAGES, {
    fetchPolicy: "cache-and-network",
  });

  const buildList = () => {
    return <List data={data.binnedImages}></List>;
  };

  if (data) {
    if (data.binnedImages.length !== 0) {
      returnData = <div>{buildList()}</div>;
    } else {
      returnData = <h2>You have not binned any images yet!</h2>;
    }
  } else if (loading) {
    returnData = <h2>Loading...</h2>;
  } else if (error) {
    returnData = <h2>{error}</h2>;
  }
  return returnData;
}

export default MyBin;
