// Componente de exemplo corrigido seguindo padrões de codificação
// ESLint + Airbnb + Prettier

interface StyleErrorComponentProps {
  data: string;
}

export default function StyleErrorComponent({
  data,
}: StyleErrorComponentProps) {
  return (
    <div>
      <p className="text-red-500">{data}</p>
    </div>
  );
}

