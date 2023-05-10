import { gql } from "@apollo/client";

const GET_UNSPLASH_PHOTOS = gql`
  query GetUnsplashPhotos($pageNumber: Int) {
    unsplashImages(pageNum: $pageNumber) {
      id
      url
      posterName
      description
      userPosted
      binned
    }
  }
`;

const GET_BINNED_IMAGES = gql`
  query GetBinnedImages {
    binnedImages {
      id
      url
      posterName
      description
      userPosted
      binned
    }
  }
`;

const GET_USER_POSTED_IMAGES = gql`
  query GetUserPostedImages {
    userPostedImages {
      id
      url
      posterName
      description
      userPosted
      binned
    }
  }
`;

const UPLOAD_IMAGE = gql`
  mutation Mutation($url: String!, $description: String, $posterName: String) {
    uploadImage(url: $url, description: $description, posterName: $posterName) {
      id
    }
  }
`;

const UPDATE_IMAGE = gql`
  mutation Mutation(
    $id: ID!
    $url: String
    $posterName: String
    $description: String
    $userPosted: Boolean
    $binned: Boolean
  ) {
    updateImage(
      id: $id
      url: $url
      posterName: $posterName
      description: $description
      userPosted: $userPosted
      binned: $binned
    ) {
      id
      binned
    }
  }
`;

const DELETE_IMAGE = gql`
  mutation Mutation($id: ID!) {
    deleteImage(id: $id) {
      id
    }
  }
`;

let exported = {
  GET_UNSPLASH_PHOTOS,
  GET_BINNED_IMAGES,
  GET_USER_POSTED_IMAGES,
  UPLOAD_IMAGE,
  UPDATE_IMAGE,
  DELETE_IMAGE,
};

export default exported;
