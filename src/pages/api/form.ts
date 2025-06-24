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

api_form.updateUser = async (id: number, data: any) => {
  try {
    const response = await api_form.put(`usuarios/gerenciar/${id}/`, data);
    return response;
  } catch (error: any) {
    if (error?.response?.status === 401) {
      throw error;
    }
  }
};

api_form.deleteUser = async (id: number) => {
  try {
    const response = await api_form.delete(`usuarios/gerenciar/${id}/`);
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

api_form.getDataSuap = async (token: string) => {
  try {
    const response = await api_form.get(
      "https://suap.ifrn.edu.br/api/v2/minhas-informacoes/meus-dados",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error: any) {
    if (error?.response?.status === 401) {
      throw error;
    }
  }
};

export { api_form };
