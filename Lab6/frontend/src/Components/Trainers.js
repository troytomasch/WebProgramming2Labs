import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import actions from "../actions";

const format = (string) => {
  if (string.includes("-")) {
    string = string.replace("-", " ");
  }
  return string[0].toUpperCase() + string.substr(1);
};

const Trainers = () => {
  const dispatch = useDispatch();
  const [trainerName, setTrainerName] = useState("");
  const [currentTrainer, setCurrentTrainer] = useState(undefined);
  const trainers = useSelector((state) => state.trainers);

  const formSubmitted = (e) => {
    e.preventDefault();
    const trainerNameInput = document.getElementById("trainerNameInput");
    trainerNameInput.value = "";
    dispatch(actions.addTrainer(trainerName));
  };

  const editTrainerName = (e) => {
    setTrainerName(e.target.value);
  };

  return (
    <div>
      <h1>Trainers</h1>
      <form
        onSubmit={(e) => {
          formSubmitted(e);
        }}
      >
        <label>
          Enter trainer's name
          <input
            type="text"
            name="trainerName"
            id="trainerNameInput"
            onChange={(e) => {
              editTrainerName(e);
            }}
          ></input>
        </label>
        <input type="submit" value="Create Trainer"></input>
      </form>
      <ul className="buttonsDiv">
        {trainers.map((trainer) => {
          let buttons = (
            <div>
              <button
                className="buttonsT"
                onClick={(e) => {
                  dispatch(actions.deleteTrainer(trainer.id));
                }}
              >
                Delete Trainer
              </button>
              <button
                className="buttonsT"
                onClick={(e) => {
                  dispatch(actions.selectTrainer(trainer.id));
                  setCurrentTrainer(trainer);
                }}
              >
                Select Trainer
              </button>
            </div>
          );
          let team = (
            <div className="pokelist">
              {trainer.team.map((pokemon) => {
                return (
                  <Link
                    className="pokelink"
                    to={`/pokemon/${pokemon.pokemonId}`}
                  >
                    {format(pokemon.pokemonName)}
                  </Link>
                );
              })}
            </div>
          );
          if (trainer.selected) {
            buttons = <button>Selected</button>;
          }
          return (
            <li key={trainer.id}>
              <p>{trainer.trainerName}</p>
              {buttons}
              {team}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Trainers;
