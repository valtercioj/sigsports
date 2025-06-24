import axios from "axios";

export const apiSuap = axios.create({
  baseURL: "https://suap.ifrn.edu.br/api/v2/",
});

export const api = axios.create({
  baseURL: "https://sigsport.pythonanywhere.com/api/",
});
export const api2 = axios.create({
  baseURL: "https://sigsport2.pythonanywhere.com/api/",
});
