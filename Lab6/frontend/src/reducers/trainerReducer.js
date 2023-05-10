import { v4 as uuid } from "uuid";
const initialState = [
  {
    id: uuid(),
    trainerName: "Trainer",
    selected: false,
    team: [],
  },
];

const trainerReducer = (state = [], action) => {
  const { type, payload } = action;
  let copyState = null;
  let index = 0;
  let pokemonIndex = 0;

  switch (type) {
    case "ADD_TRAINER":
      return [
        ...state,
        {
          id: uuid(),
          trainerName: payload.trainerName,
          selected: false,
          team: [],
        },
      ];
    case "DELETE_TRAINER":
      copyState = [...state];
      index = copyState.findIndex((x) => x.id === payload.id);
      copyState.splice(index, 1);
      return [...copyState];
    case "SELECT_TRAINER":
      copyState = [...state];
      for (let i of copyState) {
        if (i.id === payload.id) {
          i.selected = true;
          continue;
        }
        i.selected = false;
      }
      return [...copyState];
    case "CATCH_POKEMON":
      copyState = [...state];
      index = copyState.findIndex((x) => x.id === payload.id);
      copyState[index].team.push({
        pokemonId: payload.pokemonId,
        pokemonName: payload.pokemonName,
      });
      return [...copyState];
    case "RELEASE_POKEMON":
      copyState = [...state];
      index = copyState.findIndex((x) => x.id === payload.id);
      for (let i = 0; i < copyState[index].team.length; i++) {
        if (copyState[index].team[i].pokemonId == payload.pokemonId) {
          pokemonIndex = i;
          break;
        }
      }
      copyState[index].team.splice(pokemonIndex, 1);
      return [...copyState];
    default:
      return state;
  }
};

export default trainerReducer;
