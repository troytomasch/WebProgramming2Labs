const { ApolloServer, gql } = require("apollo-server");
const { default: axios } = require("axios");
require("dotenv").config();
const uuid = require("uuid");
const redis = require("redis");
const client = redis.createClient();
client.connect();

client.on("error", function (err) {
  console.log("Error " + err);
});

const accessKey = process.env.ACCESS_KEY;
let baseURL =
  "https://api.unsplash.com/photos/?client_id=" + accessKey + "&page=";

const typeDefs = gql`
  type ImagePost {
    id: ID!
    url: String!
    posterName: String!
    description: String
    userPosted: Boolean!
    binned: Boolean!
  }

  type Query {
    unsplashImages(pageNum: Int): [ImagePost]
    binnedImages: [ImagePost]
    userPostedImages: [ImagePost]
  }

  type Mutation {
    uploadImage(
      url: String!
      description: String
      posterName: String
    ): ImagePost
    updateImage(
      id: ID!
      url: String
      posterName: String
      description: String
      userPosted: Boolean
      binned: Boolean
    ): ImagePost
    deleteImage(id: ID!): ImagePost
  }
`;

const resolvers = {
  Query: {
    unsplashImages: async (_, args) => {
      const pageNum = args.pageNum;
      const url = baseURL + String(pageNum);
      const data = await axios.get(url);
      let list = [];
      for (image of data.data) {
        let imagePost = {
          id: image.id,
          url: image.urls.raw,
          posterName: image.user.name,
          description: image.description,
          userPosted: false,
          binned: false,
        };
        list.push(imagePost);
      }
      return list;
    },
    binnedImages: async () => {
      const binned = await client.lRange("binnedImages", 0, -1);
      let imagePost = null;
      let binnedImages = [];
      for (let i of binned) {
        imagePost = JSON.parse(i);
        if (imagePost.binned == true) {
          binnedImages.push(imagePost);
        }
      }
      return binnedImages;
    },
    userPostedImages: async () => {
      const binned = await client.lRange("binnedImages", 0, -1);
      let imagePost = null;
      let userImages = [];
      for (let i of binned) {
        imagePost = JSON.parse(i);
        if (imagePost.userPosted == true) {
          userImages.push(imagePost);
        }
      }
      return userImages;
    },
  },
  Mutation: {
    uploadImage: async (_, args) => {
      let imagePost = {
        id: uuid.v4(),
        url: args.url,
        description: args.description,
        posterName: args.posterName,
        userPosted: true,
        binned: false,
      };
      await client.lPush("binnedImages", JSON.stringify(imagePost));
      return imagePost;
    },
    updateImage: async (_, args) => {
      const allBinned = await client.lRange("binnedImages", 0, -1);
      let image = null;
      for (let i of allBinned) {
        let photo = JSON.parse(i);
        if (photo.id == args.id) {
          image = i;
          break;
        }
      }
      await client.lRem("binnedImages", 1, image);
      let imagePost = {
        id: args.id,
        url: args.url,
        posterName: args.posterName,
        description: args.description,
        userPosted: args.userPosted,
        binned: args.binned,
      };
      if (args.userPosted || args.binned) {
        await client.lPush("binnedImages", JSON.stringify(imagePost));
      }
      return imagePost;
    },
    deleteImage: async (_, args) => {
      const data = await client.lRange("binnedImages", 0, -1);
      let imagePost = null;
      for (let i of data) {
        let image = JSON.parse(i);
        if (image.id == args.id) {
          imagePost = i;
        }
      }
      if (imagePost) {
        await client.lRem("binnedImages", 1, imagePost);
        return JSON.parse(imagePost);
      } else {
        throw "Could not find post";
      }
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
