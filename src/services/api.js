import axios from "axios";
import Cookies from "js-cookie";

const getToken = Cookies.get("AccessToken");

export default axios.create({
  baseURL: `https://bootcamp.akbolat.net`,
  headers: getToken
    ? { Authorization: `Bearer ${getToken}` }
    : { Accept: "application/json", "Content-Type": "application/json" },
});
