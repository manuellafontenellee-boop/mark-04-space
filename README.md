# MARCO 04 SPACE · RECIFE · 2049 — Last Signal / versão 3

Jogo educativo independente para quatro pessoas. Interface pixel art e responsiva, em português e inglês. Não é um produto da NASA nem opera uma estação real.

## Abrir e jogar

O arquivo único `MARCO-04-SPACE.html`, entregue separadamente, funciona ao ser aberto no navegador, sem instalação. Escolha PT-BR ou ENGLISH no cabeçalho; os diálogos educativos também têm seletor próprio.

Fluxo: Começar → briefing dos quatro segmentos → quatro jogadores presenciais → funções secretas → missão e hipótese → componentes e inspeção → revisão → lançamento/simulação → crise → dossiê.

As quatro funções existentes foram preservadas: comandante, engenharia, ciência e operações. Um dos três assessores é o impostor. Todos os participantes são humanos. As cores e símbolos próprios dos astronautas são azul/estrela, amarelo/sol, verde/folha e vermelho/raio.

## O que mudou

1. Briefing com segmento de lançamento, espacial, terrestre/Recife e usuários. É uma arquitetura didática orientada pela visão de sistema completo, não uma declaração de que toda missão NASA se divide obrigatoriamente nessas quatro categorias.
2. Last Signal agora é uma missão fictícia de espaço profundo, após observações de Marte. A trajetória interplanetária exige lançador médio e aceita 450 kg; órbitas terrestres continuam disponíveis nos cenários Linha d’Água e Linha de Calor. Potência dos painéis já representa disponibilidade na distância de operação no Sistema Solar interior; não representa painéis em Júpiter. O custo de trajetória de 3 créditos é navegação simplificada; a entrega de massa/energia é modelada no lançador.
3. Cada um dos 14 itens de catálogo tem botão Inspecionar com os três tópicos: função, custo/trade-off e risco. É possível inspecionar itens mesmo quando não se tem recursos para selecioná-los.
4. Avisos explicam as relações entre orçamento, massa, potência, geração de dados e comunicação. A transmissão insuficiente permite lançar, mas limita a ciência que pode chegar à Terra. Orçamento máximo segue 160 créditos; plataforma-base: 100 kg, 15 W, 12 créditos.
5. Simulação com oito segundos até o meio do trecho acelerado, então antena obstruída e link reduzido a 10%. A janela de crise dura 60 segundos de tempo real. Deslocamento, coleta, propagação de sinais e escalas de dados são comprimidos; não é uma simulação orbital ou de rádio de alta fidelidade.
6. Dossiê com balanço de ciência, massa, potência, orçamento, arquivos recuperados, fórmula da pontuação, registro de comandos e comparação com a Galileo. Relatório exportável em texto. Referências oficiais em um diálogo no rodapé.

## Como funciona a crise

Os valores em GB/dia são uma escala fictícia de planejamento. Cada janela de 60 segundos representa um período normalizado de recuperação. A quantidade recuperada é integrada ao longo do tempo: `capacidade efetiva × segundos transcorridos / 60`, limitada ao volume produzido. O tempo entre comandos é contabilizado com a configuração que estava ativa naquele intervalo.

Os dados já foram coletados/armazenados; o objetivo da janela é recuperar esse arquivo. Desligar sensores reduz novas amostras e aplica uma penalidade simplificada ao valor final, mas não apaga retroativamente os arquivos antigos.

Controles (cada um pode ser aplicado uma única vez):

- **Prioridade de energia:** desliga os sensores secundários e preserva o principal da missão (atmosférico, radar ou térmico). Libera a soma dos Watts desses sensores, multiplica o link por 1,8 e reduz a amostragem científica em 10%. Se não houver sensor secundário, o botão explica a indisponibilidade. A antena permanece travada. Este corte de cargas é uma analogia de gestão de energia; power cycling em sentido estrito é desligar e religar um equipamento.
- **Compressão:** usa 6 W adicionais, comprime 3:1 e retém 90% da qualidade científica. Aumenta os dados originais equivalentes recuperados, sem aumentar a taxa física do rádio. O computador precisa de margem de potência; se não houver, tente liberar cargas primeiro.
- **Reforço terrestre:** custa 20 créditos de reserva e multiplica o link efetivo por 3. Sem reserva, fica indisponível com explicação. O dinheiro é contabilizado uma vez; não cria energia na sonda.

O rádio de emergência exige 20 W adicionais. Se a geração não sustentar o consumo, o link cai proporcionalmente à fração de potência disponível ao transmissor. As alternativas não são uma lista obrigatória: escolher não desligar sensores pode preservar mais ciência quando já há energia suficiente.

Encerrar a janela cedo mantém apenas os dados que já chegaram. Sem ação, ela fecha automaticamente. Trocar idioma, recarregar ou reconectar não reinicia o prazo. O som é opcional e ativado por gesto do usuário; o alerta visual e a animação funcionam independentemente dele. Há suporte a preferência de movimento reduzido.

## Pontuação

O valor científico planejado depende dos instrumentos escolhidos. Recuperação fracionária, qualidade, amostragem e cobertura multiplicam esse valor. Os pesos dos instrumentos herdados foram mantidos:

- Last Signal: atmosférico 45; térmico 20; solar 20; óptico 15. Transferência tem fator de cobertura 1.
- Linha d’Água: radar 75; óptico 10; órbita heliossíncrona 15 ou LEO 7. LEO também mantém o fator de revisita 0,82 da versão anterior.
- Linha de Calor: térmico 65; óptico 25; órbita heliossíncrona 10 ou LEO 5. LEO mantém o fator de revisita 0,82.

Ciência ≥65 indica sucesso; de 35 a 64, parcial; abaixo de 35, insucesso. Pontuação geral: 70% ciência + 20% viabilidade + 10% eficiência. Eficiência considera componentes e eventual reforço terrestre. Encontrar o impostor não substitui produzir ciência.

Exemplo de teste: Last Signal, espectrômetro atmosférico + sensor térmico + radiômetro solar; painéis expandidos, banda X, transferência interplanetária, lançador médio. Massa: 450 kg; custo antes da crise: 140; reserva: 20. Aplique compressão e reforço terrestre cedo, sem desligar os sensores, e aguarde a recuperação: pode atingir 100% dos arquivos e 77% de ciência. Se também desligar secundários, sacrifica amostragem mas recupera arquivos mais rapidamente. Não agir produz baixo retorno científico.

## História real e fontes

Em abril de 1991, a antena de alto ganho da Galileo não abriu completamente. Ela previa até 134.400 bits/s. A comparação com aproximadamente 10 bits/s descreve a alternativa de baixo ganho nas condições de Júpiter sem as melhorias, não uma queda fixa medida durante toda a viagem. A recuperação foi desenvolvida durante anos e usou software, compressão, codificação e melhorias/combinação de antenas terrestres. A NASA descreve taxa efetiva de 1–2 kbit/s após as melhorias.

A redução de 90%, a janela de 60 segundos, o custo em créditos e os multiplicadores de jogo são fictícios. O corte de cargas não destravou a antena real. A estação Recife + DSN é fictícia. Nenhum dado NASA é consultado em tempo real.

- Galileo: https://science.nasa.gov/mission/galileo/
- Taxa nominal no press kit JPL: https://www.jpl.nasa.gov/news/press_kits/gllarpk.pdf
- Recuperação das comunicações: https://www.nasa.gov/image-article/july-1995-galileo-reached-jupiter/
- NASA Systems Engineering Handbook: https://www.nasa.gov/reference/systems-engineering-handbook/
- JPL Concept Maturity Levels / seminário NASA ASTRA: https://science.nasa.gov/astrophysics/programs/physics-of-the-cosmos/community/astra-initiative-seminar-22-may-2026/
- Deep Space Network: https://www.nasa.gov/communicating-with-missions/dsn/
- Relatório técnico JPL da Galileo: https://descanso.jpl.nasa.gov/DPSummary/Descanso5--Galileo.pdf

## Executar o projeto / multiplayer real

Requisito: Node.js 20 ou superior. Nenhuma biblioteca externa.

```text
node server.cjs
```

Abra `http://localhost:8765`. Para usar outra porta, configure a variável de ambiente PORT. Para outro aparelho na mesma rede, abra `http://IP-DO-COMPUTADOR:8765` e crie a sala usando esse endereço. Cada jogador precisa de um navegador ou dispositivo separado. `localhost` sempre aponta para o aparelho de quem abre o link.

O anfitrião cria a sala, compartilha o link e opera as escolhas de missão e os três controles; a equipe acompanha as alterações e conversa pelo chat. O servidor valida lançamentos, orçamento de reserva, comandos e prazos. Os clientes só recebem a própria identidade de impostor, até o resultado.

As salas ficam em memória por seis horas. Reiniciar o servidor apaga as salas. Reconectar pelo mesmo navegador e link recupera a identidade. Não há substituição de participantes; se alguém sair definitivamente, criem outra sala. A integração anterior de polling a cada 1,4 segundo foi mantida.

**HTML isolado e hospedagem estática:** funcionam para o modo presencial. O link público Sites publica a interface/HTML, mas não executa `server.cjs`. Multiplayer entre pessoas fora da mesma rede exige hospedar este servidor Node em HTTPS público. Use `node server.cjs` como comando inicial e a porta da variável PORT. Se um proxy reescrever Host, configure PUBLIC_ORIGIN com a origem HTTPS exata. Nenhuma regra de firewall ou roteador foi alterada.

## Gerar HTML único

```text
node build-html.cjs
```

O comando gera `MARCO-04-SPACE.html` nesta pasta. Todos os scripts e estilos são incorporados e nenhuma fonte ou imagem externa é necessária. Também aceita um caminho de saída como argumento.

## Testar

```text
node --test tests/*.test.cjs
```

Onze testes verificam funções/impostor, trajetórias/massa, ciência dos cenários, falha em 90%, janela e integração temporal, comandos precoces/tardios, perdas de qualidade/amostragem, custos/potência, bloqueio de duplicatas, persistência do prazo, quatro clientes HTTP, permissões/privacidade e renderização dos textos/cards/dossiê em ambos os idiomas.

Os testes de interface usam funções de renderização e um DOM mínimo em memória: não substituem um navegador real. A ferramenta de navegador não respondeu nesta sessão; a revisão visual final em desktop/celular e o áudio em dispositivos reais permanecem pendentes.

## English quick start

Open the standalone HTML, choose ENGLISH and Start. Read the four-segment briefing, register four local players, reveal roles privately, select a mission, inspect components and review the spacecraft. After launch, the crisis starts at eight seconds. The 60-second window has three commands: power priority, compression and ground support. Commands have modeled power, budget and science costs; earlier actions recover more data. Wait for recovery before closing the window. Read or download the dossier and redesign to retry.

For real synchronized online play, run the Node server and create a room from its HTTP address. Remote internet play requires public HTTPS hosting of the Node server; a standalone HTML or static website does not run it. The 2049 crisis is fictional and inspired by Galileo, with official sources listed in the game and above.
