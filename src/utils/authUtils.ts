import { destroyCookie } from "nookies";

export const handleLogout = (router: any) => () => {
  destroyCookie(null, "sig-token");
  destroyCookie(null, "sig-refreshToken");
  destroyCookie(null, "matricula");
  destroyCookie(null, "nome");
  destroyCookie(null, "foto");
  destroyCookie(null, "adm");
  destroyCookie(null, "Tour");
  destroyCookie(null, "id");
  router.push("/login");
};
