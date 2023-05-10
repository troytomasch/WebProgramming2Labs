import React from "react";
import { useMutation } from "@apollo/client";
import queries from "../queries";

const NewPost = () => {
  let returnData = null;
  let [addPost, { loading: loading, error: error, data: data }] = useMutation(
    queries.UPLOAD_IMAGE
  );

  returnData = (
    <div>
      <h2 id="message"></h2>
      <form
        id="newPostForm"
        onSubmit={(e) => {
          e.preventDefault();
          let url = document.getElementById("inputURL").value;
          let desc = document.getElementById("inputdesc").value;
          let posterName = document.getElementById("inputname").value;
          if (!url || !desc || !posterName) {
            document.getElementById("message").innerHTML =
              "Must enter valid data for each field";
            return;
          }
          try {
            let validURL = new URL(url);
          } catch (e) {
            document.getElementById("message").innerHTML =
              "Must enter valid URL";
            return;
          }
          addPost({
            variables: {
              url: url,
              description: desc,
              posterName: posterName,
            },
          });
          document.getElementById("message").innerHTML =
            "Added post to your posts!";
          document.getElementById("inputURL").value = "";
          document.getElementById("inputdesc").value = "";
          document.getElementById("inputname").value = "";
        }}
      >
        <label>
          Enter the URL of your image
          <input name="url" id="inputURL"></input>
        </label>
        <br></br>
        <label>
          Enter the description of your image{" "}
          <input name="desc" id="inputdesc"></input>
        </label>

        <br></br>
        <label>
          Enter your name or the author of the photo
          <input name="posterName" id="inputname"></input>
        </label>
        <br></br>
        <input type="submit" value="Create Post"></input>
      </form>
    </div>
  );

  return returnData;
};

export default NewPost;
