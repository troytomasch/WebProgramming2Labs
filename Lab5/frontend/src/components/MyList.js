import React, { useState } from "react";
import List from "./List";
import { useQuery } from "@apollo/client";
import queries from "../queries";

function MyList() {
  let returnData = null;
  let { loading, error, data } = useQuery(queries.GET_USER_POSTED_IMAGES, {
    fetchPolicy: "cache-and-network",
  });
  const buildList = () => {
    return <List data={data.userPostedImages}></List>;
  };

  if (data) {
    if (data.userPostedImages.length !== 0) {
      returnData = <div>{buildList()}</div>;
    } else {
      returnData = <h2>You have not posted any images yet!</h2>;
    }
  } else if (loading) {
    returnData = <h2>Loading...</h2>;
  } else if (error) {
    returnData = <h2>{error}</h2>;
  }
  return returnData;
}

export default MyList;
