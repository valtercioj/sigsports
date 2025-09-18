import React from "react";
import { Button, Result } from "antd";
import { useRouter } from "next/router";
export default function NotFound() {
  const router = useRouter();
  const handleBackHome = () => {
    router.reload();
  };
  return (
    <div className="flex flex-col items-center p-6 text-white-default">
      <Result status="500" />

      <div className="flex flex-col items-center gap-y-4">
        <h1 className="ant-result-title text-2xl">ERRO</h1>
        <p className="ant-result-subtitle">
          Desculpe, ocorreu um erro interno no servidor.
        </p>

        <Button
          onClick={handleBackHome}
          type="primary"
          className="text-white-default hover:text-white-default"
          style={{ backgroundColor: "#3c89e8" }}
        >
          Tentar Novamente
        </Button>
      </div>
    </div>
  );
}
