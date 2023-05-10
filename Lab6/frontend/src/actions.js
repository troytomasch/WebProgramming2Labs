const addTrainer = (trainerName) => ({
  type: "ADD_TRAINER",
  payload: {
    trainerName: trainerName,
  },
});

const deleteTrainer = (id) => ({
  type: "DELETE_TRAINER",
  payload: {
    id: id,
  },
});

const selectTrainer = (id) => ({
  type: "SELECT_TRAINER",
  payload: {
    id: id,
  },
});

const catchPokemon = (id, pokemonId, pokemonName) => ({
  type: "CATCH_POKEMON",
  payload: {
    id: id,
    pokemonId: pokemonId,
    pokemonName: pokemonName,
  },
});

const releasePokemon = (id, pokemonId) => ({
  type: "RELEASE_POKEMON",
  payload: {
    id: id,
    pokemonId: pokemonId,
  },
});

module.exports = {
  addTrainer,
  deleteTrainer,
  selectTrainer,
  catchPokemon,
  releasePokemon,
};
