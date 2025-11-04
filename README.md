# Projeto Clima — React + TypeScript + Vite

![Capa do projeto](./public/images/CapaApp.png)

Aplicação de previsão do tempo que usa a API OpenWeatherMap. Resolve ambiguidade de cidades com geocoding e apresenta: temperatura, condição, mín/máx, umidade, chuva, vento (direção/velocidade), data/hora local e fundo visual dinâmico conforme a condição climática.

## App Clima
- https://clima-tempo-oz17.vercel.app/

## Principais funcionalidades
- Busca por cidade com geocoding (evita ambiguidade, ex.: "Roma, IT").
- Exibição: temperatura atual, mínima, máxima e descrição em português.
- Hora e data local da cidade (usando dt + timezone da API).
- Fundo dinâmico conforme o código do clima (imagens em `public/images`).
- Indicador de vento: bússola com agulha apontando a direção e velocidade (m/s e km/h).
- Modo dia/noite com visual distinto.
- Tratamento de erros e indicador de carregamento.

## Tecnologias
- React + TypeScript
- Vite
- OpenWeatherMap API
- CSS Modules

## Capturas de tela
- Tela inicial: `./public/images/screenshot.png`
- Resultado com clima: `./public/images/comClima.png`
- Resultado dark mode: `./public/images/darkMode.png`

## Instalação (local)
1. Clone o repositório:
   ```bash
   git clone <URL-do-repo>
   ```
2. Entre na pasta:
   ```bash
   cd projeto_react_clima
   ```
3. Instale as dependências:
   ```bash
   npm install
   ```
4. Crie o arquivo `.env` na raiz com sua chave (não commitar):
   ```env
   VITE_OPENWEATHER_KEY=SEU_API_KEY_AQUI
   ```
5. Execute em desenvolvimento:
   ```bash
   npm run dev
   ```
6. Build de produção:
   ```bash
   npm run build
   ```
7. Preview do build:
   ```bash
   npm run preview
   ```

## Segurança da API key
- Nunca comite a chave. Use `.env` (já referenciado pelo Vite via `import.meta.env`).
- Inclua `.env` no `.gitignore`.
- Em produção, considere mover chamadas que usam a key para um backend para evitar exposição no bundle.

## Deploy (Vercel)
1. Suba o código no GitHub.
2. Na Vercel: New Project → Import Git Repository → selecione o repositório.
3. Configure a variável `VITE_OPENWEATHER_KEY` em Environment Variables.
4. Deploy automático a cada push na branch configurada.

## Contribuição
- Pull requests são bem-vindos. Abra uma issue para discutir mudanças maiores.

## Contato
- Leonam Suertegaray Santorum — leosuerte@gmail.com
- GitHub: https://github.com/Leosansu
