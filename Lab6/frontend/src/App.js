import "./App.css";
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";
import Home from "./Components/Home";
import IndividualPokemon from "./Components/IndividualPokemon";
import PokemonList from "./Components/PokemonList";
import Trainers from "./Components/Trainers";

function App() {
  return (
    <div className="App">
      <Router>
        <nav className="nav">
          <NavLink className="NavLink" to={"/"}>
            Home
          </NavLink>
          <NavLink className="NavLink" to={"/pokemon/page/1"}>
            Pokemon
          </NavLink>
          <NavLink className="NavLink" to={"/trainers"}>
            Trainers
          </NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pokemon/page/:pagenum" element={<PokemonList />} />
          <Route path="/pokemon/:id" element={<IndividualPokemon />} />
          <Route path="/trainers" element={<Trainers />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
