// const API_URL = "https://script.google.com/macros/s/AKfycbwNEXOb0NjgZeork1u_hmWK7gZsyAYtRb1iPbn-YW6HZaaJh_SbjHUMwfTkf_QIeH5rxw/exec";
const API_URL = "https://script.google.com/macros/s/AKfycby8kR_7h0GiR8AsF3ugh3ivphC-CjgmwpUwZ9FtEzixejlfu_SWWyDbSi2t6kJbl3cE/exec";

// CONFIGURAÇÃO DOS CAMPOS
const CAMPOS = {
  DESCRICAO: {
    label: "Descrição",
    mostrar: true,
    largura: "full"
  },
  CLASSIFICACAO: {
    label: "Grupo",
    mostrar: true
  },
  CENTRO_CUSTO: {
    label: "Centro de Custo",
    mostrar: true
  },
  VALOR_MATERIAL: {
    label: "Valor do Material",
    mostrar: true,
    tipo: "moeda"
  },
  DATA_AQUISICAO: {
    label: "Data de Aquisição",
    mostrar: true,
    tipo: "data"
  }
};


function getParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

const id = getParam("id");

if (!id) {
  alert("ID do patrimônio não informado na URL.");
} else {
  fetch(`${API_URL}?id=${id}`)
  .then(res => res.json())
  .then(dados => montarTela(dados))
  .catch(() => mostrarErro());
}

function montarTela(dados) {
  document.getElementById("loading").style.display = "none";

  if (dados.erro) {
    mostrarErro();
    return;
  }

  document.getElementById("card").style.display = "block";

  document.title = `Patrimônio ${dados.ID_INTERNA}`;
  document.getElementById("id-tag").innerText = `ID: ${dados.ID_INTERNA}`;

  montarCampos(dados);
  montarFoto(dados.FOTO);
}


function montarCampos(dados) {
  const container = document.getElementById("info-group");
  container.innerHTML = "";

  Object.keys(CAMPOS).forEach(chave => {
    const cfg = CAMPOS[chave];
    const valor = dados[chave];

    if (!cfg.mostrar || valor === "" || valor === null) return;

    const div = document.createElement("div");
    div.className = "info-item" + (cfg.largura === "full" ? " full" : "");

    const strong = document.createElement("strong");
    strong.innerText = cfg.label;

    const span = document.createElement("span");
    span.innerText = formatar(valor, cfg.tipo);

    div.appendChild(strong);
    div.appendChild(span);
    container.appendChild(div);
  });
}

function montarFoto(nomeFoto) {
  if (!nomeFoto) {
    document.getElementById("foto-container").style.display = "none";
    return;
  }

  const img = document.getElementById("foto");
  img.src = `fotos/${nomeFoto}`;

  img.onerror = () => {
    document.getElementById("foto-container").style.display = "none";
  };
}



function formatar(valor, tipo) {
  if (!tipo) return valor;

  if (tipo === "moeda") {
    return Number(valor).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });
  }

  if (tipo === "data") {
    return new Date(valor).toLocaleDateString("pt-BR");
  }

  return valor;
}

function mostrarErro() {
  document.getElementById("loading").innerText = "Patrimônio não encontrado";
}
