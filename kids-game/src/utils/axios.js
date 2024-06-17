import axios from "axios";

const url = "http://localhost:3001";

const customAxios = axios.create({
  baseURL: url,
});

export default customAxios;
