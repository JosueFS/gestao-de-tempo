# Projeto - Gestão de Tempo
Projeto do 2° PDI Trimestral da Jovens Gênios

### Passos para rodar o servidor:

**Faça um clone do projeto e acesse a pasta**

```bash
$ git clone https://github.com/JosueFS/gestao-de-tempo.git && cd gestao-de-tempo
```

**Crie um arquivo .env e adicione as váriaveis ambiente localizadas no arquivo do notion.**

Link do notion: https://www.notion.so/jovens-genios-jfs/Backlog-4ffd65bee0844cceaa67bd19aa726b81

As configurações abaixo dessa seção:
![image](https://user-images.githubusercontent.com/45906601/155725494-70aee893-98dc-4210-831d-4cab275e2261.png)

**É necessário gerar um token no clickUp para ter acesso a API**
$ https://app.clickup.com/api?client_id=UQC36DXVVEQTNM46Y4R5IN4E8UO7HD6C&redirect_uri=https://global.consent.azure-apim.net/

Você será direcionad a uma tela, onde escolherá seu workspace e será redirecionado para uma URL que terá o CODE 

exemplo https://global.consent.azure-apim.net/?code=TJK2GM3ZNN6RVOYBL8LNC7RPITPJH7DR

exemplo ---> const CODE = 'TJK2GM3ZNN6RVOYBL8LNC7RPITPJH7DR' <--- code example

**Siga os passos abaixo:**

```bash
# Instale as dependências
$ npm i

# Start the client
$ npm run dev
```

Agora o servidor deve estar acessível em http://localhost:4000

## Configurações iniciais que estão faltando para finalizar o boilerplate:

- [ ] Configurar babel


## Tarefas concluídas
- [x]  Criar repositório no github
    Link: https://github.com/JosueFS/gestao-de-tempo
- [x]  Adicionar permissão do repositório para o time
- [x]  Criar o banco de dados
  - [x]  Configurar Banco no site do Neo4J
- [x]  Montar o boilerplate e enviar pro github
  - [x]  README.md
  - [x]  .gitignore
  - [x]  Configurações de eslint/prettier
- [x]  Configurar o ambiente
  - [x]  Instalar as bibliotecas necessárias
  - [x]  configurar arquivos .env
  - [x]  Pegar as informações do banco de dados e configurar o servidor node
- [x] Configurar Docker
