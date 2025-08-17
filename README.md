#Gym Churn AI Platform
##🏋️‍♂️ Descrição
A Gym Churn AI Platform é uma solução inteligente projetada para academias e estúdios fitness que buscam reduzir a taxa de cancelamento de matrículas (churn). A ferramenta utiliza Inteligência Artificial para analisar transcrições de conversas do WhatsApp entre vendedores e alunos, identificando padrões de comportamento e prevendo o risco de churn.

Com base na metodologia C.A.R.E. (Conexão, Análise, Resolução e Engajamento), a plataforma avalia a qualidade das interações e fornece insights valiosos para reter clientes e melhorar a performance da equipe.

###✨ Funcionalidades Principais
Análise de Conversas com IA: Faça upload de áudios ou transcrições de conversas para uma análise automática e detalhada.

Metodologia C.A.R.E.: Avaliação de conversas baseada em 4 pilares: Conexão, Análise, Resolução e Engajamento.

Previsão de Churn: O sistema calcula a porcentagem de risco de cada aluno e sugere a melhor ação de intervenção.

Dashboards por Nível de Acesso:

Administrador: Visão completa da saúde do sistema, logs, gestão de usuários e configuração do modelo de IA.

Gestor: Acompanhamento de KPIs de retenção, performance da equipe, gerenciamento de campanhas e intervenção em usuários de risco.

Agente/Vendedor: Foco na performance individual, evolução de scores C.A.R.E. e histórico de análises de conversas.

Alertas e Insights Inteligentes: Receba recomendações e alertas em tempo real gerados por IA para otimizar a retenção.

Relatórios Conversacionais: Gere relatórios com explicações em áudio sobre a performance e engajamento.

Assistente Virtual com IA: Interaja com um chatbot para obter análises rápidas sobre os dados do dashboard.

###🏗️ Arquitetura e Fluxo da Aplicação
O diagrama abaixo ilustra a arquitetura geral da aplicação, desde a autenticação até a análise de dados pela IA.

Snippet de código

graph TD
    subgraph "Fluxo de Autenticação"
        A[Usuário] --> B{Login};
        B --> C{Verifica Tipo de Usuário};
        C -- Admin --> D[Painel do Administrador];
        C -- Gestor --> E[Painel do Gestor];
        C -- Agente --> F[Painel do Vendedor];
    end

    subgraph "Painel do Vendedor (Agente)"
        F --> G[Dashboard com KPIs Pessoais];
        G --> H["Análise C.A.R.E. (Conexão, Análise, Resolução, Engajamento)"];
        G --> I[Upload de Áudio/Transcrição];
        I --> J[OpenAI Whisper: Áudio para Texto];
        J --> K[CAREAnalysisService];
        K --> L[Google Gemini: Gera Score e Insights];
        L --> M[Exibe Análise Detalhada];
    end

    subgraph "Painel do Gestor"
        E --> N[Dashboard com KPIs da Equipe];
        N --> O[Usuários com Risco de Churn];
        O --> P[Modal de Intervenção Imediata];
        N --> Q[Gerenciamento de Campanhas];
        N --> R[Chat Assistant com IA];
    end

    subgraph "Painel do Administrador"
        D --> S[Monitoramento da Saúde do Sistema];
        S --> T[Status de Serviços: API, DB, IA];
        D --> U[Gestão de Usuários do Sistema];
        D --> V[Configuração do Modelo de IA];
    end

    subgraph "Serviços de IA"
        style K fill:#f9f,stroke:#333,stroke-width:2px
        style J fill:#bbf,stroke:#333,stroke-width:2px
        style L fill:#bbf,stroke:#333,stroke-width:2px
        style R fill:#bbf,stroke:#333,stroke-width:2px
    end


    classDef user fill:#fff,stroke:#333,stroke-width:2px;
    class A,B,C,F,E,D user;
##🚀 Tecnologias Utilizadas
Este projeto foi construído com as seguintes tecnologias:

Frontend: Vite, React, TypeScript

Estilização: Tailwind CSS, shadcn-ui

Inteligência Artificial: Google AI (Gemini), OpenAI (Whisper, TTS)

Gerenciamento de Estado: React Query

Roteamento: React Router

Gráficos: Recharts

Formulários: React Hook Form

##🛠️ Como Executar o Projeto Localmente
Para rodar este projeto em sua máquina local, siga os passos abaixo. É necessário ter o Node.js e o npm instalados.

Bash

# 1. Clone o repositório
git clone https://github.com/Messias-Daniel-Dev/gym-churn-ai-platform.git

# 2. Navegue até o diretório do projeto
cd gym-churn-ai-platform

# 3. Instale as dependências
npm install

# 4. Inicie o servidor de desenvolvimento
npm run dev
Após executar os comandos, o projeto estará disponível em http://localhost:8080.

🖼️ Telas da Aplicação
(Esta seção é um ótimo lugar para você adicionar screenshots da sua aplicação para que os visitantes possam ver como ela é.)

Exemplo: Dashboard do Gestor
![Dashboard do Gestor](URL_DA_SUA_IMAGEM_AQUI)

Exemplo: Modal de Intervenção
![Modal de Intervenção](URL_DA_SUA_IMAGEM_AQUI)

licença
Este projeto está licenciado sob a licença MIT.
