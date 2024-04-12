# Documentação API Flows

Esta documentação detalha a API desenvolvida com o conceito de strategies, responsável por interagir com payloads criptografados, processar esses dados e responder também de forma criptografada. A API é integrada ao sistema da Meta através de webhooks em Flows criados dentro da Waba, onde payloads são recebidos e devem ser processados com os parâmetros necessários para renderizar a tela dos Flows.

## Visão Geral do Endpoint

### Endpoint `/flow`

- **Método HTTP:** POST
- **Descrição:** Recebe dados criptografados, os descriptografa, processa a lógica de negócios, e retorna os dados criptografados.

**Fluxo de Processamento:**
1. **Recepção e Descriptografia:** Dados criptografados são recebidos e descriptografados usando `decryptRequest`.
2. **Verificação de Integridade da API:** Quando o Flows está em produção, o método `healthCheck` é utilizado para que a Meta verifique a integridade da API.
3. **Processamento da Lógica de Negócios:** Utiliza o conteúdo descriptografado através do método `getScreenData`.
4. **Criptografia e Resposta:** A resposta é criptografada por `encryptResponse` e enviada ao solicitante.

## Métodos de Criptografia e Descriptografia

### `decryptRequest`

Descriptografa os dados recebidos utilizando RSA e AES. A chave privada e a passphrase são carregadas de arquivos de configuração. Uma chave pública RSA 2048 Bits é configurada no PhoneNumberID que exibe o Flows, usada pela Meta para criptografar os payloads.

**Parâmetros:**
- `encrypted_aes_key`: Chave AES criptografada.
- `encrypted_flow_data`: Dados criptografados.
- `initial_vector`: Vetor inicial.

**Retorno:**
- `decryptedBody`: Corpo descriptografado.
- `aesKeyBuffer`: Buffer da chave AES.
- `initialVectorBuffer`: Buffer do vetor inicial.

### `encryptResponse`

Criptografa os dados da resposta usando AES-128-GCM.

**Parâmetros:**
- `response`: Dados da resposta.
- `aesKeyBuffer`: Buffer da chave AES.
- `initialVectorBuffer`: Vetor inicial modificado.

**Retorno:**
- Dados criptografados em formato base64.

## Regras de Negócio e Fluxo de Telas

### `getScreenData`

Este método é central na API. Recebe o nome da tela (`screenName`) e o contexto do usuário (`userContext`) para redirecionar para a lógica apropriada de processamento de tela.

**Telas:**
- **Tela Inicial (`INICIAL`)**: Processa e retorna dados para a tela inicial.
- **Tela Final (`FINAL`)**: Valida e retorna dados para a tela final.

### Telas e Lógicas Específicas

#### Tela Inicial (`initScreenData`)

Prepara dados dinâmicos e controla a visibilidade de elementos na tela com base no contexto do usuário.

#### Tela Final (`endScreenData`)

Valida dados de entrada e prepara mensagens de erro ou sucesso. Registra eventos e prepara dados para a tela de sucesso, se aplicável.

## Integração com Blip para Criação de Trackings

### `createTracking`

Este método é utilizado para criar trackings dentro da plataforma Blip. Utiliza a biblioteca `axios` para fazer requisições HTTP e `uuidv4` para gerar identificadores únicos para cada evento.

**Funcionalidade:**
- Envia um evento de tracking para "postmaster@analytics.msging.net".
- Utiliza informações como categoria e ação do evento, além da identidade do contato (usuário).

**Exemplo de Uso:**
```javascript
createTracking("Category", "Action", "contact.identity");
```
