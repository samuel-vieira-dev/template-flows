# Documentação API Flows

Esta documentação detalha a API desenvolvida com o conceito de strategies, responsável por interagir com payloads criptografados, processar esses dados e responder também de forma criptografada. A API é integrada ao sistema da Meta através de webhooks em Flows criados dentro da Waba, onde payloads são recebidos e devem ser processados com os parâmetros necessários para renderizar a tela dos Flows.

# Sumário

- [Visão Geral do Endpoint](#visão-geral-do-endpoint)
- [Métodos de Criptografia e Descriptografia](#métodos-de-criptografia-e-descriptografia)
- [Regras de Negócio e Fluxo de Telas](#regras-de-negócio-e-fluxo-de-telas)
- [Integração com Blip para Criação de Trackings](#integração-com-blip-para-criação-de-trackings)
- [Integração com a API dos Meus Objetivos](#integração-com-a-api-dos-meus-objetivos)
- [Boas Práticas na Implementação de Endpoints para Flows](#boas-práticas-na-implementação-de-endpoints-para-flows)
- [Referências](#referências)
- [WELJ - JSON dos Meus Objetivos](#welj---json-dos-meus-objetivos)

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

# Integração com a API dos Meus Objetivos

A nova tela do Flows será dedicada a exibir recomendações de produtos de investimento, com o suporte da API dos Meus Objetivos. A integração desta API é crucial para fornecer recomendações personalizadas e precisas, baseadas nas informações do usuário e em seus objetivos de investimento.

## Endpoint de Recomendação de Investimento

O endpoint `/api/v1/recommendations/brand/{brand}/calculate-recommendation` será utilizado para obter recomendações de produtos de investimento. Ele requer parâmetros específicos e retorna respostas definidas com base no status do pedido.

**Endpoint:** `GET /api/v1/recommendations/brand/{brand}/calculate-recommendation`

### Parâmetros Necessários:

- `InitialValue` (number): 100 valor mínimo considerado para a recomendação.
- `FinalValue` (number): 300 valor mínimo desejado pelo investimento.
- `ClientId` (integer): O identificador único do cliente na base de dados.
- `Month` (integer): O mês de referência para a recomendação.
- `Year` (integer): O ano de referência para a recomendação.
- `IsEmergencyReserve` (boolean): Indica se é ou não reserva de emergência.
- `brand` (integer): Identificador da marca, com os valores disponíveis sendo 3 (XP) e 386 (Rico).

### Respostas do Endpoint:

- `200 OK`: Sucesso na operação, com retorno do `offerId` e `monthlyValue`.
- `400 Bad Request`: Requisição inválida, geralmente acompanhada de mensagens de erro.
- `500 Server Error`: Erro interno do servidor, indicando problemas na execução do serviço.

### Processo de Integração:

1. **Coleta de Dados:** A API deve coletar os valores do input do usuário de dentro do flows através da variável userContext.

2. **Requisição à API:** Com os dados coletados, uma requisição GET deve ser feita ao endpoint mencionado, inserindo os parâmetros na URL.

3. **Tratamento da Resposta:** Dependendo do código de resposta:
   - **Sucesso (200):** Retornar o JSON pedido pelo WELJ com os paramêtros necessários.
   - **Erro (400 ou 500):** Retornar JSON com error_messages explicando o motivo.

4. **Exibição dos Resultados:** A tela deve apresentar a recomendação de forma clara, incluindo identificação da oferta e o valor mensal do investimento.

5. **Fluxo Contínuo:** Se a API retornar sucesso, o usuário pode prosseguir para possíveis ações subsequentes, como aceitar a recomendação ou alterar seus parâmetros de objetivo.

## Integração com a API dos Meus Objetivos para Salvar Objetivo no App

Esta seção aborda a integração com a API dos Meus Objetivos para a funcionalidade de salvamento de metas de investimento, permitindo que as metas definidas sejam exibidas nos aplicativos da Rico e XP.

### Endpoint para Salvamento de Metas

Para salvar uma meta de investimento, usamos o endpoint `POST /api/v1/goals/brand/{brand}/save-goal`, que aceita uma série de parâmetros para registrar a meta do usuário.

**Endpoint:** `POST /api/v1/goals/brand/{brand}/save-goal`

### Parâmetros do Path:

- `brand` (integer): Identificador da marca, com os valores disponíveis sendo 3 (XP) e 386 (Rico).

### Corpo da Requisição:

O corpo da requisição deve conter os detalhes da meta, incluindo:

```json
{
  "clientId": 0,
  "categoryId": 0,
  "offerId": "string",
  "initialValue": 100,
  "finalValue": 300,
  "month": 12,
  "year": 2024,
  "description": "string"
}
```

# Boas Práticas na Implementação de Endpoints para Flows

Ao implementar a lógica dos endpoints que alimentam os Flows, deve-se evitar o uso desnecessário do endpoint para reduzir a latência para os consumidores e simplificar o desenvolvimento do Flow.

Seu endpoint receberá requisições nos seguintes casos:

- **Usuário abre o flow:**
  - Se o campo `flow_action` nos parâmetros que você passa para o On-Prem ou CAPI ao enviar uma mensagem de flow for `data_exchange`;
  - Veja Pedido de Troca de Dados para detalhes.
  - **Dica:** Se a primeira tela do seu flow não tem parâmetros ou os parâmetros são conhecidos quando a mensagem é enviada, considere omitir `flow_action` para evitar chamar seu endpoint. Você pode fornecer parâmetros usando o campo `flow_action_payload.data` da mensagem.

- **Usuário envia a tela:**
  - Se o atributo `name` especificado dentro do campo `on-click-action` no JSON do Flow for `data_exchange`;
  - Veja Pedido de Troca de Dados para detalhes.
  - **Dica:** Se a próxima tela e seus dados já são conhecidos, considere definir o `on-click-action name` para navegar para evitar chamar seu endpoint.

- **Usuário pressiona o botão voltar na tela:**
  - Se o atributo `refresh_on_back` especificado no JSON do Flow para a tela for `true`;
  - Veja Pedido de Troca de Dados para detalhes.
  - **Dica:** Se um comportamento personalizado ao pressionar o botão voltar não for necessário, considere omitir `refresh_on_back` para evitar chamar seu endpoint.

- **Usuário altera o valor de um componente:**
  - Se `on-select-action` para o componente é definido no JSON do Flow.

- **Seu endpoint respondeu com conteúdo inválido ao pedido anterior (por exemplo, um campo obrigatório estava faltando), nesse caso, o cliente do consumidor enviará um pedido de notificação de erro assíncrono:**
  - Veja Pedido de Notificação de Erro.

- **Verificação periódica de saúde do WhatsApp:**
  - Veja Pedido de Verificação de Saúde.

## Pedido de Troca de Dados

O pedido de troca de dados é usado para consultar o nome da próxima tela e os dados necessários para renderizá-la. O payload descriptografado do pedido de troca de dados terá o seguinte formato.

**Exemplo de Payload de Pedido de Troca de Dados:**

```json
{
    "version": "<VERSION>",
    "action": "<ACTION_NAME>",
    "screen": "<SCREEN_NAME>",
    "data": {
      "prop_1": "value_1",
      ...
      "prop_n": "value_n"
    },
   "flow_token": "<FLOW-TOKEN>"
}
```
| Parâmetro  | Descrição |
|------------|-----------|
| version    | (obrigatório) string Valor deve ser definido como 3.0 Para programa Beta apenas: inteiro 200 |
| screen     | (obrigatório) string Se action for definido como INIT ou BACK, este campo pode não ser preenchido. |
| action     | (obrigatório) string Define o tipo do pedido. Para pedidos de troca de dados, existem múltiplas escolhas dependendo de quando o gatilho é acionado - INIT se o pedido é acionado ao abrir o Flow, BACK se acionado ao pressionar "voltar", data_exchange se acionado ao enviar a tela. |
| data       | (obrigatório) objeto Um objeto passando dados chave-valor arbitrários como um objeto JSON. |
| flow_token | (obrigatório) string Um token de Flow gerado e enviado por você como parte da mensagem de Flow. |

## Payload de Resposta da Próxima Tela para Pedido de Troca de Dados:

```json
{
    "version": "<VERSION>",
    "screen": "<SCREEN_NAME>",
    "data": {
      "property_1": "value_1",
      ...
      "property_n": "value_n",
      "error_message": "<ERROR-MESSAGE>"
    }
}
```
## Payload Final de Resposta

Para desencadear a conclusão do flow, envie a seguinte resposta ao pedido de troca de dados:

```json
{
  "version": "<VERSION>",
  "screen": "SUCCESS",
  "data": {
    "extension_message_response": {
      "params": {
        "flow_token": "<FLOW_TOKEN>",
        "optional_param1": "<value1>",
        "optional_param2": "<value2>"
      }
    }
  }
}
```
| Parâmetro  | Descrição |
|------------|-----------|
| version    | (obrigatório) string Valor deve ser definido como 3.0 Para programa Beta apenas: inteiro 200 |
| screen     | (obrigatório) string Se action for definido como INIT ou BACK, este campo pode não ser preenchido. |
| data.extension_message_response.params       | (obrigatório) Um JSON com dados que serão incluídos na mensagem de conclusão do fluxo |
| data.extension_message_response.params.flow_token | (obrigatório) string Um token de Flow gerado e enviado por você como parte da mensagem de Flow. |



## Referências

Para obter mais informações sobre a implementação de endpoints para Flows, monitoramento de saúde e códigos de erro, consulte os seguintes recursos:

- [Guia de Implementação do Endpoint do Flow](https://developers.facebook.com/docs/whatsapp/flows/guides/implementingyourflowendpoint)
- [Guia de Monitoramento de Saúde](https://developers.facebook.com/docs/whatsapp/flows/guides/healthmonitoring)
- [Referência de Códigos de Erro](https://developers.facebook.com/docs/whatsapp/flows/reference/error-codes)
- [Como funciona o WELJ](https://developers.facebook.com/docs/whatsapp/flows/reference/flowjson)

## WELJ - JSON dos Meus Objetivos

Abaixo está uma demonstração do JSON usado para criar as telas dos Meus Objetivos no WhatsApp. Aqui você pode encontrar os parâmetros necessários para renderizar cada tela. (screens[i].data)

```json
{
    "version": "3.1",
    "data_api_version": "3.0",
    "routing_model": {
      "INICIAL": [
        "FINAL"
      ],
      "FINAL": []
    },
    "screens": [
      {
        "id": "INICIAL",
        "title": "Primeiro Passo",
        "data": {
          "error_messages": {
            "type": "object",
            "__example__": {
              "valorObjetivo": "Exemplo"
            }
          },
          "proximoMes": {
            "type": "string",
            "__example__": "1693569600000"
          },
          "nomeObjetivoVisible": {
            "type": "boolean",
            "__example__": false
          },
          "mensagemInicial": {
            "type": "string",
            "__example__": "Interessante! Podemos alcançar qualquer sonho com planejamento. ✍️"
          },
          "mensagemValorObjetivo": {
            "type": "string",
            "__example__": "Quanto você precisa juntar para alcançar esse objetivo único?"
          },
          "mensagemValorInvestimento": {
            "type": "string",
            "__example__": "Qual valor mensal você pode investir nesse objetivo?"
          },
          "mensagemDataObjetivo": {
            "type": "string",
            "__example__": "Até quando você gostaria de alcançar esse objetivo especial?"
          }
        },
        "layout": {
          "type": "SingleColumnLayout",
          "children": [
            {
              "type": "Form",
              "name": "text_input_form",
              "children": [
                {
                  "type": "TextCaption",
                  "text": "Passo 1 de 2"
                },
                {
                  "type": "TextSubheading",
                  "text": "Selecione uma opção:"
                },
                {
                  "type": "Dropdown",
                  "name": "primeiroPasso",
                  "label": "Escolha um objetivo",
                  "data-source": [
                    {
                      "id": "0",
                      "title": "Reserva de Emergência 🚑",
                      "description": "Segurança financeira para imprevistos, essencial para tranquilidade."
                    },
                    {
                      "id": "1",
                      "title": "Liberdade Financeira 💸",
                      "description": "Conquiste a liberdade que tanto sonhou"
                    },
                    {
                      "id": "2",
                      "title": "Aposentadoria 🏖️",
                      "description": "Construa o futuro dos seus sonhos"
                    },
                    {
                      "id": "3",
                      "title": "Shows e Eventos 🎤",
                      "description": "Viva experiências únicas"
                    },
                    {
                      "id": "4",
                      "title": "Casa Nova 🏡",
                      "description": "Conquiste sua casa ou faça reformas"
                    },
                    {
                      "id": "5",
                      "title": "Viagem ✈️",
                      "description": "Faça a viagem dos seus sonhos"
                    },
                    {
                      "id": "6",
                      "title": "Carro Novo 🚗",
                      "description": "Compre o carro que você tanto quer"
                    },
                    {
                      "id": "7",
                      "title": "Estudos 🎓",
                      "description": "Planeje seus estudos ou de seus filhos"
                    },
                    {
                      "id": "8",
                      "title": "Outros Objetivos ✍️",
                      "description": "Te ajudamos a alcançar qualquer objetivo"
                    }
                  ],
                  "required": true,
                  "on-select-action": {
                    "name": "data_exchange",
                    "payload": {
                      "trigger": "primeiroPasso",
                      "primeiroPasso": "${form.primeiroPasso}"
                    }
                  }
                },
                {
                  "type": "TextSubheading",
                  "text": "Qual nome você quer dar para este objetivo especial?",
                  "visible": "${data.nomeObjetivoVisible}"
                },
                {
                  "type": "TextInput",
                  "input-type": "text",
                  "name": "nomeObjetivo",
                  "label": "Ex.: Viajar",
                  "max-chars": 23,
                  "required": false,
                  "visible": "${data.nomeObjetivoVisible}"
                },
                {
                  "type": "Footer",
                  "label": "Continuar",
                  "on-click-action": {
                    "name": "data_exchange",
                    "payload": {
                      "next": "FINAL",
                      "primeiroPasso": "${form.primeiroPasso}",
                      "nomeObjetivo": "${form.nomeObjetivo}",
                      "proximoMes": "${data.proximoMes}",
                      "mensagemInicial": "${data.mensagemInicial}",
                      "mensagemValorObjetivo": "${data.mensagemValorObjetivo}",
                      "mensagemValorInvestimento": "${data.mensagemValorInvestimento}",
                      "mensagemDataObjetivo": "${data.mensagemDataObjetivo}"
                    }
                  }
                }
              ]
            }
          ]
        }
      },
      {
        "id": "FINAL",
        "title": "Meus Objetivos",
        "terminal": true,
        "data": {
          "error_messages": {
            "type": "object",
            "__example__": {
              "valorObjetivo": "investe ai paizao"
            }
          },
          "primeiroPasso": {
            "type": "string",
            "__example__": "Example"
          },
          "nomeObjetivo": {
            "type": "string",
            "__example__": "Example"
          },
          "proximoMes": {
            "type": "string",
            "__example__": "1693569600000"
          },
          "mensagemInicial": {
            "type": "string",
            "__example__": "Interessante! Podemos alcançar qualquer sonho com planejamento. ✍️"
          },
          "mensagemValorObjetivo": {
            "type": "string",
            "__example__": "Quanto você precisa juntar para alcançar esse objetivo único?"
          },
          "mensagemValorInvestimento": {
            "type": "string",
            "__example__": "Qual valor mensal você pode investir nesse objetivo?"
          },
          "mensagemDataObjetivo": {
            "type": "string",
            "__example__": "Até quando você gostaria de alcançar esse objetivo especial?"
          }
        },
        "layout": {
          "type": "SingleColumnLayout",
          "children": [
            {
              "type": "Form",
              "name": "form",
              "error-messages": "${data.error_messages}",
              "children": [
                {
                  "type": "TextCaption",
                  "text": "Passo 2 de 2"
                },
                {
                  "type": "TextBody",
                  "font-weight": "bold",
                  "text": "${data.mensagemInicial}"
                },
                {
                  "type": "TextSubheading",
                  "text": "${data.mensagemValorObjetivo}"
                },
                {
                  "type": "TextCaption",
                  "text": "Insira o valor sem os centavos."
                },
                {
                  "type": "TextInput",
                  "input-type": "number",
                  "name": "valorObjetivo",
                  "label": "Ex.: 15000",
                  "helper-text": "Valor mí­nimo: R$300",
                  "min-chars": 3,
                  "max-chars": 8,
                  "required": true
                },
                {
                  "type": "TextSubheading",
                  "text": "${data.mensagemValorInvestimento}"
                },
                {
                  "type": "TextCaption",
                  "font-weight": "normal",
                  "text": "Insira o valor sem os centavos."
                },
                {
                  "type": "TextInput",
                  "input-type": "number",
                  "name": "valorInvestimento",
                  "label": "Ex.: 750",
                  "helper-text": "Valor mí­nimo: R$100",
                  "min-chars": 3,
                  "max-chars": 8,
                  "required": true
                },
                {
                  "type": "TextSubheading",
                  "text": "${data.mensagemDataObjetivo}"
                },
                {
                  "type": "TextCaption",
                  "text": "Quanto menor for o prazo, maior o valor investido mensalmente."
                },
                {
                  "type": "DatePicker",
                  "name": "dataObjetivo",
                  "label": "Insira a data",
                  "helper-text": "Ex.: 25/12/2030",
                  "min-date": "${data.proximoMes}",
                  "required": true
                },
                {
                  "type": "Footer",
                  "label": "Finalizar",
                  "on-click-action": {
                    "name": "data_exchange",
                    "payload": {
                      "acao": "finalizar",
                      "primeiroPasso": "${data.primeiroPasso}",
                      "nomeObjetivo": "${data.nomeObjetivo}",
                      "valorObjetivo": "${form.valorObjetivo}",
                      "valorInvestimento": "${form.valorInvestimento}",
                      "dataObjetivo": "${form.dataObjetivo}"
                    }
                  }
                }
              ]
            }
          ]
        }
      }
    ]
  }
```
