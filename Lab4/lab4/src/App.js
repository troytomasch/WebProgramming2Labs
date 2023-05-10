import "./App.css";
import React from "react";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import CharacterList from "./components/CharacterList";
import SeriesList from "./components/SeriesList";
import ComicsList from "./components/ComicsList";
import CharacterPage from "./components/CharacterPage";
import ComicPage from "./components/ComicPage";
import SeriesPage from "./components/SeriesPage";

function App() {
  return (
    <Router>
      <div className="App">
        <header className="AppHeader">
          <h1 className="AppTitle">Welcome to the Marvel API SPA</h1>
        </header>
        <Link className="CharactersList" to="/characters/page/0">
          Characters
        </Link>
        <br></br>
        <Link className="ComicsList" to="/comics/page/0">
          Comics
        </Link>
        <br></br>
        <Link className="SeriesPage" to="/series/page/0">
          Series
        </Link>
        <Routes>
          <Route path="/characters/page/:page" element={<CharacterList />} />
          <Route path="/characters/:id" element={<CharacterPage />} />
          <Route path="/comics/page/:page" element={<ComicsList />} />
          <Route path="/comics/:id" element={<ComicPage />} />
          <Route path="/series/page/:page" element={<SeriesList />} />
          <Route path="/series/:id" element={<SeriesPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
