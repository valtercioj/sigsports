# Diagramas UML

Este diretório contém os diagramas UML gerados automaticamente a partir do código fonte do projeto.

## Diagrama de Classes de Domínio

O diagrama de classes é gerado automaticamente usando [tplant](https://github.com/nickkimura/tplant), uma ferramenta que analisa arquivos TypeScript e gera diagramas PlantUML.

### Geração Local

Para gerar o diagrama de classes localmente, execute:

```bash
# Gerar arquivo PlantUML (.puml)
npm run uml:generate

# Gerar imagem PNG diretamente (requer PlantUML instalado)
npm run uml:png
```

### Pipeline CI/CD

O diagrama é gerado automaticamente durante a execução do pipeline CI/CD. Os artefatos gerados incluem:

- `class-diagram.puml` - Arquivo fonte PlantUML
- `class-diagram.png` - Imagem PNG do diagrama

### Classes de Domínio

As principais classes/tipos de domínio da aplicação estão em:

- `src/utils/typeTurma.ts` - Tipos relacionados a Turmas (TFormData, TProfessor, TModalidade, Tcategoria, TTurma)
- `src/utils/typeSolicitar.ts` - Tipos relacionados a Solicitações (TModality, TCategory, TFormData)
- `src/contexts/AuthContext.tsx` - Tipos de autenticação (AuthContextType, SignInCredentials, UserType)
- `src/services/api.ts` - Configuração de APIs

### Requisitos para geração local da imagem PNG

Para converter o arquivo `.puml` em PNG localmente, você precisa:

1. Java Runtime Environment (JRE)
2. PlantUML JAR
3. Graphviz (para layouts de diagramas)

```bash
# Ubuntu/Debian
sudo apt-get install default-jre graphviz
wget https://github.com/plantuml/plantuml/releases/download/v1.2024.3/plantuml-1.2024.3.jar

# Converter para PNG
java -jar plantuml-1.2024.3.jar -tpng docs/diagrams/class-diagram.puml
```
