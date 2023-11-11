import { Client, URI } from "../utils";
import { foodInterface } from "../models";

function search(name: string, offset = 0, limit = 10) {
  return Client.request(
    "GET",
    new URI(`api/food/?name=:name&offset=:offset&limit=:limit`, {
      name,
      offset,
      limit,
    })
  )
    .then((results) => {
      return results;
    })
    .catch((err) => err);
}

function save(food: foodInterface) {
  Client.request("POST", new URI("food"), food);
}

export default {
  search,
  save,
};
