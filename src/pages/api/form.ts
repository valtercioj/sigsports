/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable consistent-return */
import axios from "axios";

const api_form: any = axios.create({
  baseURL: "https://sigsport2.pythonanywhere.com/api/v1/",
});

api_form.getAllUsers = async () => {
  try {
    const response = await api_form.get("usuarios/");
    return response;
  } catch (error: any) {
    if (error?.response?.status === 401) {
      throw error;
    }
  }
};

api_form.createUser = async (data: any) => {
  try {
    const response = await api_form.post("usuarios/", data);
    return response;
  } catch (error: any) {
    if (error?.response?.status === 401) {
      throw error;
    }
  }
};

export { api_form };
