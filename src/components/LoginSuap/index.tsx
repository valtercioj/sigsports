"use client";

import { loginWithSuap } from "@/lib/useSuapAuth";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="mb-4 text-2xl font-bold">Login com SUAP</h1>
      <button
        type="button"
        onClick={loginWithSuap}
        className="text-white rounded-md bg-blue-600 px-4 py-2"
      >
        Entrar com SUAP
      </button>
    </div>
  );
}
