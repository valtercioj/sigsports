import { RotateCcw } from "lucide-react";
import { useRouter } from "next/router";

export default function Rollback() {
  const router = useRouter();
  return (
    <div className="flex h-full w-full items-center">
      <button
        type="button"
        onClick={() => router.back()}
        className="mr-3  flex items-center gap-x-2  p-2 hover:cursor-pointer"
      >
        <RotateCcw className="text-green-300" />
        Voltar
      </button>
    </div>
  );
}
