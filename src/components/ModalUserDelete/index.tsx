/* eslint-disable react/jsx-no-bind */
import { Modal } from "antd";
import { toast } from "react-toastify";
import { useState } from "react";
import api from "@/pages/api";

export type ModalDelete = {
  isModalDeleteOpen: boolean;
  setIsModalDeleteOpen: (params: boolean) => void;
  selectedUsers: number[];
  userId: number | undefined;
  refetch: any;
};

export default function Index({
  isModalDeleteOpen,
  setIsModalDeleteOpen,
  selectedUsers,
  userId,
  refetch,
}: ModalDelete) {
  const [Loading, setLoading] = useState(false);
  const deleteUser = async () => {
    setLoading(true);
    if (selectedUsers.length === 0) {
      try {
        await api.deleteUser(userId);
        toast.success("Usuário excluído com sucesso!");
        setIsModalDeleteOpen(false);
        refetch();
      } catch (error) {
        toast.error("Erro ao excluir usuário.");
      } finally {
        setLoading(false);
      }
    } else {
      const deletionPromises = selectedUsers.map(async (id) => {
        try {
          await api.deleteUser(id); // Passa o ID de cada usuário
          return { success: true, id };
        } catch (error) {
          return { success: false, id, error };
        } finally {
          setLoading(false);
        }
      });

      const results = await Promise.all(deletionPromises);

      const allDeleted = results.every((result) => result.success);

      if (allDeleted) {
        // Mostrar notificação de sucesso
        toast.success("Todos os usuários foram excluídos com sucesso!");
        setIsModalDeleteOpen(false);
        refetch();
      } else {
        // Mostrar notificação de erro
        toast.error("Ocorreu um erro ao excluir alguns usuários.");
      }
    }
  };

  function handleCancel() {
    setIsModalDeleteOpen(false);
  }

  return (
    <Modal
      title="Deletar Usuário"
      open={isModalDeleteOpen}
      okButtonProps={{
        loading: Loading,
        className: "bg-emerald-950 text-white",
      }} // Estilo para o botão "OK"
      cancelButtonProps={{ className: "bg-red-500 text-white-default" }}
      okText="Confirmar" // Texto para o botão "OK"
      cancelText="Cancelar" // Texto para o botão "Cancelar"
      onOk={deleteUser}
      onCancel={handleCancel}
    >
      <div>
        {selectedUsers &&
          selectedUsers.length > 1 &&
          `Tem certeza que deseja excluir esses usuários?`}
        {selectedUsers &&
          selectedUsers.length === 1 &&
          `Tem certeza que deseja excluir esse usuário?`}
        {userId != null &&
          selectedUsers &&
          selectedUsers.length === 0 &&
          "Tem certeza que deseja excluir esse usuário?"}
      </div>
    </Modal>
  );
}
