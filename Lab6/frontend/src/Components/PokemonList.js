import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import actions from "../actions";
import axios from "axios";

const format = (string) => {
  if (string.includes("-")) {
    string = string.replace("-", " ");
  }
  return string[0].toUpperCase() + string.substr(1);
};

const PokemonList = () => {
  const [pokemonData, setPokemonData] = useState(undefined);
  const [currentTrainer, setCurrentTrainer] = useState(undefined);
  const [error, setError] = useState(null);
  const trainers = useSelector((state) => state.trainers);
  let { pagenum } = useParams();
  let pageButtons = null;
  const nextUrl = `/pokemon/page/${Number(pagenum) + 1}`;
  const prevUrl = `/pokemon/page/${Number(pagenum) - 1}`;

  useEffect(() => {
    for (let trainer of trainers) {
      if (trainer.selected) {
        setCurrentTrainer(trainer);
        break;
      }
    }
  }, [trainers]);

  useEffect(() => {
    async function getData() {
      try {
        const url = `http://localhost:3001/pokemon/page/${Number(pagenum) - 1}`;
        let { data } = await axios.get(url);
        setPokemonData(data.results);
      } catch (e) {
        setError("404 Error");
      }
    }
    getData();
  }, [pagenum]);

  if (pagenum == 1) {
    pageButtons = (
      <div>
        <Link to={nextUrl} className="pageButtons">
          Next
        </Link>
      </div>
    );
  } else {
    pageButtons = (
      <div>
        <Link to={prevUrl} className="pageButtons">
          Previous
        </Link>
        <Link to={nextUrl} className="pageButtons">
          Next
        </Link>
      </div>
    );
  }

  if (pokemonData) {
    return (
      <div>
        {pageButtons}
        <div className="pokemonList">
          {pokemonData.map((pokemon) => {
            let id = pokemon.url.slice(34, -1);
            return (
              <Pokemon
                key={id}
                currentTrainer={currentTrainer}
                pokemon={pokemon}
              />
            );
          })}
        </div>
      </div>
    );
  } else if (error) {
    return <h2>{error}</h2>;
  }
};

const Pokemon = (props) => {
  const dispatch = useDispatch();
  const pokemon = props.pokemon;
  let id = pokemon.url.slice(34, -1);
  let catchRelease = "Catch";
  if (props.currentTrainer) {
    for (let current of props.currentTrainer.team) {
      if (id === current.pokemonId) {
        catchRelease = "Release";
        break;
      }
    }
  }
  return (
    <div className="pokemon">
      <Link to={`/pokemon/${id}`} className="pokemonLink">
        {format(pokemon.name)}
      </Link>
      <button
        className="catchButton"
        onClick={(e) => {
          if (!props.currentTrainer) {
            console.log("No trainer");
            return;
          }
          if (catchRelease == "Catch" && props.currentTrainer.team.length < 6) {
            dispatch(
              actions.catchPokemon(props.currentTrainer.id, id, pokemon.name)
            );
          } else if (catchRelease == "Release") {
            dispatch(actions.releasePokemon(props.currentTrainer.id, id));
          }
        }}
      >
        {catchRelease}
      </button>
    </div>
  );
};

export default PokemonList;
