import React from "react";
import {
  NavLink,
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import MyBin from "./components/MyBin";
import MyList from "./components/MyList";
import NewPost from "./components/NewPost";
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloProvider,
} from "@apollo/client";

const client = new ApolloClient({
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          unsplashImages: {
            keyArgs: false,
            merge(existing = [], incoming) {
              return [...existing, ...incoming];
            },
          },
        },
      },
    },
  }),
  link: new HttpLink({
    uri: "http://localhost:4000",
  }),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div className="App">
          <h1 id="appTitle">Welcome to Bintrest</h1>
          <nav className="nav">
            <NavLink to="/" className="navLink">
              Home
            </NavLink>
            <NavLink to="/my-bin" className="navLink">
              My Bin
            </NavLink>
            <NavLink to="/my-posts" className="navLink">
              My Posts
            </NavLink>
            <NavLink to="/new-post" className="navLink">
              Create new Post
            </NavLink>
          </nav>
          <Routes>
            <Route exact path="/" element={<Home />}></Route>
            <Route path="/my-bin" element={<MyBin />}></Route>
            <Route path="/my-posts" element={<MyList />}></Route>
            <Route path="/new-post" element={<NewPost />}></Route>
          </Routes>
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
