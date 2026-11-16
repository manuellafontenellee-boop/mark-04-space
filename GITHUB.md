# Colocar no GitHub

1. Extraia o ZIP.
2. No GitHub, crie um repositório e escolha **Add file → Upload files**.
3. Envie todo o conteúdo extraído, mantendo `package.json`, `server.cjs` e `README.md` na raiz do repositório. Preserve as pastas `dist`, `tests` e `assets`.
4. Confirme em **Commit changes**.

O pacote não inclui histórico Git, credenciais nem configuração interna da hospedagem Sites.

## Executar

Com Node.js 20 ou superior, na pasta do projeto:

```text
node server.cjs
```

Abra http://localhost:8765. Não é necessário instalar pacotes externos.

```text
node --test tests/*.test.cjs
node build-html.cjs
```

O segundo comando gera um HTML único para o modo presencial.

## Publicar

Subir o código ao GitHub não publica automaticamente o jogo. GitHub Pages pode servir os arquivos da pasta `dist`, mas não executa `server.cjs`: nessa hospedagem, o jogo funciona presencialmente. Para salas online sincronizadas, use hospedagem Node.js com HTTPS e comando inicial `node server.cjs`.

## Personagens atuais

Os quatro SVGs enviados pela autora já estão incorporados em `dist/game.js` como imagens, sem depender de arquivos externos. Os originais editáveis estão em `assets/characters`, na ordem azul, amarelo, verde e vermelho. Alterar os arquivos originais não modifica automaticamente as imagens incorporadas.
