import React, { useEffect, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import queries from "../queries";

const List = (props) => {
  let returnData = null;
  const photos = props.data;
  let [addToBin, { loading: addLoading, error: addError, data: addData }] =
    useMutation(queries.UPDATE_IMAGE);
  let [
    deleteUserPost,
    { loading: deleteLoading, error: deleteError, data: deleteData },
  ] = useMutation(queries.DELETE_IMAGE);
  let {
    loading: binLoading,
    error: binError,
    data: binData,
  } = useQuery(queries.GET_BINNED_IMAGES, { fetchPolicy: "cache-and-network" });

  if (binData) {
    returnData = (
      <ul className="imageList">
        {photos.map((photo) => {
          let desc = "Description not available";
          let binned = "Add to Bin";
          let deletePost = null;
          for (let i of binData.binnedImages) {
            if (i.id === photo.id) {
              binned = "Remove from Bin";
              break;
            }
          }
          if (photo.description) {
            desc = photo.description;
          }
          if (
            photo.userPosted &&
            window.location.href == "http://localhost:3000/my-posts"
          ) {
            deletePost = (
              <button
                className="deleteButton"
                onClick={() => {
                  deleteUserPost({
                    variables: { id: photo.id },
                  });
                  document.getElementById(photo.id).hidden = true;
                }}
              >
                Delete Post
              </button>
            );
          }
          let buttonId = `Button${photo.id}`;
          return (
            <li className="singleImage" key={photo.id} id={photo.id}>
              <h3 className="title">{desc}</h3>
              <h3 className="author">an image by: {photo.posterName}</h3>
              <img src={photo.url} className="images" alt={desc}></img>
              <button
                id={buttonId}
                className="addtoBinButton"
                onClick={() => {
                  if (!photo.binned) {
                    addToBin({
                      variables: {
                        id: photo.id,
                        url: photo.url,
                        posterName: photo.posterName,
                        description: photo.description,
                        userPosted: photo.userPosted,
                        binned: true,
                      },
                    });
                    document.getElementById(buttonId).innerHTML =
                      "Remove from Bin";
                  } else {
                    addToBin({
                      variables: {
                        id: photo.id,
                        url: photo.url,
                        posterName: photo.posterName,
                        description: photo.description,
                        userPosted: photo.userPosted,
                        binned: false,
                      },
                    });
                    document.getElementById(buttonId).innerHTML = "Add to Bin";
                  }
                }}
              >
                {binned}
              </button>
              {deletePost}
            </li>
          );
        })}
      </ul>
    );
  } else if (binLoading) {
    returnData = <h2>Loading...</h2>;
  } else {
    returnData = <h2>Sorry, there was an error retrieving the data...</h2>;
  }
  return <div id="listDiv">{returnData}</div>;
};

export default List;
