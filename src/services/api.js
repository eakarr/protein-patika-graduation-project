import axios from "axios";

export default axios.create({
  baseURL: `https://bootcamp.akbolat.net`,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});