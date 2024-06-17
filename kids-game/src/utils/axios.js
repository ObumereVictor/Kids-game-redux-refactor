import axios from "axios";

// const url = "http://localhost:3001";
const url = "https://api-kidsspeelinggame.onrender.com";

const customAxios = axios.create({
  baseURL: url,
});

export default customAxios;
