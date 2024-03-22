import axios from "axios";

const getShowAddressScreenData = async (userContext) => {
  try {
    const response = await axios.get(`https://viacep.com.br/ws/${userContext.cep}/json/`);

    if (response.status === 200 && !response.data.erro) {
      return {
        version: "3.0",
        screen: "SHOW_ADDRESS",
        data: {
          cep: userContext.cep,
          logradouro: response.data.logradouro,
          bairro: response.data.bairro,
          cidade: response.data.localidade,
          uf: response.data.uf,
          inputEnable: false,
        },
      };
    }

    return {
      version: "3.0",
      screen: "SHOW_ADDRESS",
      data: {
        cep: userContext.cep,
        logradouro: "",
        bairro: "",
        cidade: "",
        uf: "",
        inputEnable: true,
      },
    };

  } catch (error) {
    return {
      version: "3.0",
      screen: "ADDRESS",
      data: {
        error_messages: {
          cep: "Insira um CEP válido gafanhoto",
        },
      },
    };
  }
};

export default getShowAddressScreenData;
