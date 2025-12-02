import { GetServerSidePropsContext } from "next";
import { api } from "@/services/api";

export const getProfessorIdFromServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { req } = context;
  const cookies = req.headers.cookie || "";
  const matricula = cookies
    .split(";")
    .find((c: string) => c.trim().startsWith("matricula="))
    ?.split("=")[1];

  const response = await api.get("v1/listarProfessores/");
  const professor = response.data.find((p: any) => p.matricula === matricula);
  const professorId = professor ? professor.id : null;

  return {
    props: {
      professorId,
    },
  };
};
