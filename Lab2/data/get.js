let data = require("../data.json");

async function getById(id) {
  try {
    if (typeof id != "number") throw "Must enter an id";
    if (isNaN(Number(id))) throw "Must enter a number";
    if (id < 0) throw "Id must be a positive integer";
  } catch (e) {
    reject(e);
  }
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let entry = null;
      for (let i of data) {
        if (id == i.id) {
          entry = i;
          break;
        }
      }
      if (entry) {
        resolve(entry);
      } else {
        reject(new Error("Person not found"));
      }
    }, 5000);
  });
}

module.exports = {
  getById,
};
