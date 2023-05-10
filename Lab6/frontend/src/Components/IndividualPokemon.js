import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import axios from "axios";
import actions from "../actions";

const IndividualPokemon = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [pokemonData, setPokemonData] = useState(undefined);
  const [currentTrainer, setCurrentTrainer] = useState(undefined);
  const [error, setError] = useState("");
  const trainers = useSelector((state) => state.trainers);

  useEffect(() => {
    for (let trainer of trainers) {
      if (trainer.selected) {
        setCurrentTrainer(trainer);
        break;
      }
    }
  }, [trainers]);

  useEffect(() => {
    const getData = async () => {
      try {
        let { data } = await axios.get(`http://localhost:3001/pokemon/${id}`);
        setPokemonData(data);
      } catch (e) {
        setError("404 Error");
      }
    };
    getData();
  }, [id]);

  const format = (string) => {
    if (string.includes("-")) {
      string = string.replace("-", " ");
    }
    return string[0].toUpperCase() + string.substr(1);
  };

  if (pokemonData) {
    let items = <li>No held items</li>;
    let types = <li>No types</li>;
    let abilities = <li>No abilities</li>;
    let catchRelease = "Catch";

    if (pokemonData.held_items.length !== 0) {
      items = pokemonData.held_items.map((item) => {
        return <li key={item.item.name}>{format(item.item.name)}</li>;
      });
    }
    if (pokemonData.abilities.length !== 0) {
      abilities = pokemonData.abilities.map((ability) => {
        return (
          <li key={ability.ability.name}>{format(ability.ability.name)}</li>
        );
      });
    }
    if (pokemonData.types.length !== 0) {
      types = pokemonData.types.map((type) => {
        return <li key={type.type.name}>{format(type.type.name)}</li>;
      });
    }
    if (currentTrainer) {
      for (let current of currentTrainer.team) {
        if (id === current.pokemonId) {
          catchRelease = "Release";
          break;
        }
      }
    }
    return (
      <div className="indivPokemon">
        <h1>{format(pokemonData.name)}</h1>
        <img
          alt={pokemonData.name}
          src={pokemonData.sprites.front_default}
        ></img>
        <h2>
          Height: {pokemonData.height}, Weight: {pokemonData.weight}
        </h2>
        <h2>Types</h2>
        <ul className="plists">{types}</ul>
        <h2>Abilities</h2>
        <ul className="plists">{abilities}</ul>
        <h2>Held Items</h2>
        <ul className="plists">{items}</ul>
        <button
          className="catchButton"
          onClick={(e) => {
            if (!currentTrainer) {
              console.log("No trainer");
              return;
            }
            if (catchRelease == "Catch" && currentTrainer.team.length < 6) {
              dispatch(
                actions.catchPokemon(currentTrainer.id, id, pokemonData.name)
              );
            } else if (catchRelease == "Release") {
              dispatch(actions.releasePokemon(currentTrainer.id, id));
            }
          }}
        >
          {catchRelease}
        </button>
      </div>
    );
  } else if (error) {
    return <h1>{error}</h1>;
  } else {
    return <h1>Loading...</h1>;
  }
};

export default IndividualPokemon;
