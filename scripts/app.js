'use strict'

//Menu de abas  
function menuAbas(aba) {
  let cadastrar = document.getElementById('cadastrar');
  let listar = document.getElementById('listar');
  let pesquisar = document.getElementById('pesquisar');
  if (aba == 'Cadastrar') {
    cadastrar.style.display = "flex";
    listar.style.display = "none";
    pesquisar.style.display = "none";
  } else if (aba == 'Listar') {
    cadastrar.style.display = "none";
    listar.style.display = "flex";
    pesquisar.style.display = "none";
  } else {
    cadastrar.style.display = "none";
    listar.style.display = "none";
    pesquisar.style.display = "flex";
  }
}

//Funcionalidades
let clientes = [];

if (!localStorage.getItem("clientes")) {
  localStorage.setItem("clientes", JSON.stringify(clientes));
}
//Aqui usei o local Storage para não perder os dados no refresh
//Pois não tem um banco de dados para salvar

function cadastrar() {
  clientes = JSON.parse(localStorage.getItem("clientes"));

  let nome = document.getElementById('nome');
  let email = document.getElementById('email');
  let id = document.getElementById('id');
  let fone = document.getElementById('fone');
  let cep = document.getElementById('cep');
  let logradouro = document.getElementById('logradouro');
  let numero = document.getElementById('numero');
  let bairro = document.getElementById('bairro');
  let cidade = document.getElementById('cidade');
  let estado = document.getElementById('estado');

  let objCli = {
    nome: nome.value,
    email: email.value,
    id: id.value,
    telefone: fone.value,
    cep: cep.value,
    logradouro: logradouro.value,
    numero: numero.value,
    bairro: bairro.value,
    cidade: cidade.value,
    estado: estado.value,
  };

  clientes.push(objCli);
  localStorage.setItem("clientes", JSON.stringify(clientes));
  alert("Cliente cadastrado com sucesso!");
}

function listar() {
  let lista = document.getElementById('listar');
  lista.innerHTML = '';

  clientes = JSON.parse(localStorage.getItem("clientes"));

  if (clientes.length == 0) {
    let divCliente = document.createElement("div");
    divCliente.classList.add('containerCli');
    const text = `<p>Nenhum cliente cadastrado</p>`;
    divCliente.innerHTML = text;
    lista.append(divCliente);
  }

  for (let element of clientes) {
    let divCliente = document.createElement("div");
    divCliente.classList.add('containerCli');
    const text = `<ul>
                        <li>Nome: ${element.nome}</li>
                        <li>E-mail: ${element.email}</li>
                        <li>CPF/CNPJ: ${element.id}</li>
                        <li>Telefone: ${element.telefone}</li>
                        <li>CEP: ${element.cep}</li>
                        <li>Logradouro: ${element.logradouro}</li>
                        <li>Numero: ${element.numero}</li>
                        <li>Bairro: ${element.bairro}</li>
                        <li>Cidade: ${element.cidade}</li>
                        <li>Estado: ${element.estado}</li>
                      </ul>`
    divCliente.innerHTML = text;
    lista.append(divCliente);
  }
}

function pesquisar() {
  let pesquisa = document.getElementById('cliPesquisa');
  pesquisa.innerHTML = '';

  let id = document.getElementById('idPesquisa').value;
  clientes = JSON.parse(localStorage.getItem("clientes"));

  for (let element of clientes) {
    if (id === element.id) {
      const text = `<ul>
                            <li>Nome: ${element.nome}</li>
                            <li>E-mail: ${element.email}</li>
                            <li>CPF/CNPJ: ${element.id}</li>
                            <li>Telefone: ${element.telefone}</li>
                            <li>CEP: ${element.cep}</li>
                            <li>Logradouro: ${element.logradouro}</li>
                            <li>Numero: ${element.numero}</li>
                            <li>Bairro: ${element.bairro}</li>
                            <li>Cidade: ${element.cidade}</li>
                            <li>Estado: ${element.estado}</li>
                            <button type="submit" class="btnExcluir" onclick="excluir();"/>Excluir</Button>
                          </ul>`
      let divCliente = document.createElement("div");
      divCliente.innerHTML = text;
      pesquisa.append(divCliente);
      return;
    }
  }
  const text = `<p>Nenhum cliente encontrado com este CPF/CNPJ</p>`;
  let divCliente = document.createElement("div");
  divCliente.innerHTML = text;
  pesquisa.append(divCliente);
}


function excluir() {
  let id = document.getElementById('idPesquisa').value;
  clientes = JSON.parse(localStorage.getItem("clientes"));

  for (let element of clientes) {
    if (id === element.id) {
      let index = clientes.indexOf(element);
      clientes.splice(index, 1);
      localStorage.setItem("clientes", JSON.stringify(clientes));
      alert("Cliente excluido com sucesso!");
    }
  }

  let pesquisa = document.getElementById('cliPesquisa');
  pesquisa.innerHTML = '';
}

//Mascaras
function formatarId(id) {
  if (id.value.length <= 11) {
    id.value = id.value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, "\$1.\$2.\$3\-\$4");
  } else {
    id.value = id.value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, "\$1.\$2.\$3\/\$4\-\$5");
  }
}

function formatarTel(tel) {
  tel.value = tel.value.replace(/\D/g, "");
  tel.value = tel.value.replace(/^(\d{2})(\d)/g, "($1) $2");
  tel.value = tel.value.replace(/(\d)(\d{4})$/, "$1-$2");
}

//API utilizada - ViaCEP
function getCep() {
  let cep = document.getElementById('cep').value;
  if (cep.length == 9) {
    const url = `https://viacep.com.br/ws/${cep}/json/`;

    try {
      fetch(url).then(response => {
        return response.json();
      }).then(data => {
        let rua = document.getElementById('logradouro');
        let bairro = document.getElementById('bairro');
        let cidade = document.getElementById('cidade');
        let estado = document.getElementById('estado');

        rua.value = data.logradouro;
        bairro.value = data.bairro;
        cidade.value = data.localidade;
        estado.value = data.uf;
      })
    } catch (e) {
      alert("CEP não encontrado");
      rua.value = "";
      bairro.value = "";
      cidade.value = "";
      estado.value = "";
    } finally {
      cep = cep.replace(/^\d{5}-\d{3}$/);
    }
  }
}

function validar() {
  if (!validaCpfCnpj(id.value)) {
    alert("CPF/CNPJ inválido " + id.value);
  }

  clientes = JSON.parse(localStorage.getItem("clientes"));
  for (let element of clientes) {
    if (id.value === element.id) {
      alert("CPF/CNPJ já cadastrado");
      return;
    }
  }
}

  function validarCadastro() {
    let id = document.getElementById('id').value;
    clientes = JSON.parse(localStorage.getItem("clientes"));
    //Verifica se o CPF/CNPJ ja está cadastrado
    for (let element of clientes) {
      if (id === element.id) {
        alert("CPF/CNPJ já cadastrado");
        return;
      }
    }

    if (validaCpfCnpj(id)) {
      cadastrar();
    } else {
      alert("CPF/CNPJ inválido " + id);
    }
  }

  //Validar CPF e CNPJ baseado no tutorial da DevMedia
  function validaCpfCnpj(id) {
    if (id.length == 14) {
      let cpf = id.trim();

      cpf = cpf.replace(/\./g, '');
      cpf = cpf.replace('-', '');
      cpf = cpf.split('');

      let v1 = 0;
      let v2 = 0;
      let aux = false;

      //Verifica se os digitos são iguais
      for (let i = 1; cpf.length > i; i++) {
        if (cpf[i - 1] != cpf[i]) {
          aux = true;
        }
      }

      if (aux == false) {
        return false;
      }

      //Calculo do primeiro digito verificador
      for (let i = 0, p = 10; (cpf.length - 2) > i; i++, p--) {
        v1 += cpf[i] * p;
      }

      v1 = ((v1 * 10) % 11);

      if (v1 == 10) {
        v1 = 0;
      }

      //Verifica se o digito está correto
      if (v1 != cpf[9]) {
        return false;
      }

      //Calculo do segundo digito verificador
      for (let i = 0, p = 11; (cpf.length - 1) > i; i++, p--) {
        v2 += cpf[i] * p;
      }

      v2 = ((v2 * 10) % 11);

      if (v2 == 10) {
        v2 = 0;
      }

      //Verifica se o segundo digito esta correto
      if (v2 != cpf[10]) {
        return false;
      } else {
        return true;
      }
    } else if (id.length == 18) {
      let cnpj = val.trim();

      cnpj = cnpj.replace(/\./g, '');
      cnpj = cnpj.replace('-', '');
      cnpj = cnpj.replace('/', '');
      cnpj = cnpj.split('');

      let v1 = 0;
      let v2 = 0;
      let aux = false;

      //Verificar se os digitos são iguais
      for (let i = 1; cnpj.length > i; i++) {
        if (cnpj[i - 1] != cnpj[i]) {
          aux = true;
        }
      }

      if (aux == false) {
        return false;
      }

      //Calculo do primeiro digito
      for (let i = 0, p1 = 5, p2 = 13; (cnpj.length - 2) > i; i++, p1--, p2--) {
        if (p1 >= 2) {
          v1 += cnpj[i] * p1;
        } else {
          v1 += cnpj[i] * p2;
        }
      }

      v1 = (v1 % 11);

      if (v1 < 2) {
        v1 = 0;
      } else {
        v1 = (11 - v1);
      }

      if (v1 != cnpj[12]) {
        return false;
      }

      //calculo do segundo digito
      for (var i = 0, p1 = 6, p2 = 14; (cnpj.length - 1) > i; i++, p1--, p2--) {
        if (p1 >= 2) {
          v2 += cnpj[i] * p1;
        } else {
          v2 += cnpj[i] * p2;
        }
      }

      v2 = (v2 % 11);

      if (v2 < 2) {
        v2 = 0;
      } else {
        v2 = (11 - v2);
      }

      if (v2 != cnpj[13]) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }