# Projeto Clima — React + TypeScript + Vite

![Capa do projeto](.public\images\CapaApp.png)

Descrição
- Aplicação de previsão do tempo que usa a API OpenWeatherMap. Resolve ambiguidade de cidades com geocoding e apresenta: temperatura, condição, mín/máx, umidade, chuva, vento (direção/velocidade), data/hora local e fundo visual dinâmico conforme a condição climática.

Demo
- URL (substitua pela URL pública do deploy): https://seu-app.vercel.app  
- GIF demonstrativo: ./public/images/demo.gif

Principais funcionalidades
- Busca por cidade com geocoding (evita ambiguidade, ex.: "Roma, IT").  
- Exibição: temperatura atual, mínima, máxima e descrição em português.  
- Hora e data local da cidade (usando dt + timezone da API).  
- Fundo dinâmico conforme o código do clima (7 imagens em public/images).  
- Indicador de vento: bússola com agulha apontando a direção e velocidade (m/s e km/h).  
- Modo dia/noite com visual distinto.  
- Tratamento de erros e indicador de carregamento.

Tecnologias
- React + TypeScript  
- Vite  
- OpenWeatherMap API  
- CSS Modules

Capturas de tela
- Tela inicial: ./public/images/screenshot.png  
- Resultado com clima: ./public/images/screenshot-weather.png

Instalação (local)
1. Clone o repositório:
   git clone <URL-do-repo>
2. Entre na pasta:
   cd projeto_react_clima
3. Instale dependências:
   npm install
4. Crie arquivo `.env` na raiz com sua chave (não commitar):
   `VITE_OPENWEATHER_KEY=SEU_API_KEY_AQUI`
5. Rodar em dev:
   npm run dev
6. Build:
   npm run build
7. Preview do build:
   npm run preview

Segurança da API key
- Nunca comite a chave pública. Use `.env` e inclua `.env` no `.gitignore`.  
- Para produção, avalie mover chamadas que usam a key para um backend (evita expor a key no bundle).

Deploy (dica rápida - Vercel)
1. Suba o código no GitHub.  
2. No Vercel: New Project → Import Git Repository → selecione o repositório.  
3. Configure variável de ambiente `VITE_OPENWEATHER_KEY` em Environment Variables.  
4. Deploy será automático a cada push na branch configurada.

Como apresentar no portfólio / LinkedIn
- Contextualize o problema: ambiguidade de cidades e fuso horário.  
- Mostre o fluxo: busca → resultado → mudança de fundo → bússola de vento.  
- Destaque decisões técnicas: por que usar geocoding; por que calcular hora com dt+timezone; uso de CSS Modules e Vite.  
- Aponte melhorias futuras: cache das respostas, previsão horária, PWA, mover chamadas sensíveis para backend.  
- Inclua links diretos para demo, repositório e imagens/GIFs nos posts.

Contribuição
- Pull requests são bem-vindos. Abra uma issue para discutir mudanças maiores.

Contato
- Leonam Suertegaray Santorum — leosuerte@gmail.com  
- GitHub: https://github.com/Leosansu

Observações finais
- Substitua os links e screenshots antes de publicar.  
- Não publique chaves no repositório público — gere e adicione a variável de ambiente no serviço de hospedagem.
