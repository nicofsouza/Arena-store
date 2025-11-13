// Espera o DOM carregar
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  form.addEventListener("submit", (e) => {
    e.preventDefault(); // impede o envio do form

    // Pega os dados do formulário
    const usuario = {
      nome: document.getElementById("nome").value,
      email: document.getElementById("email").value,
      telefone: document.getElementById("telefone").value,
      senha: document.getElementById("senha").value,
      cep: document.getElementById("cep").value,
      logradouro: document.getElementById("logradouro").value,
      bairro: document.getElementById("bairro").value,
      cidade: document.getElementById("cidade").value,
      estado: document.getElementById("estado").value,
    };

    // Busca usuários já salvos no localStorage
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    // Verifica se o e-mail já existe
    const emailExistente = usuarios.find(u => u.email === usuario.email);
    if (emailExistente) {
      alert("Este e-mail já está cadastrado!");
      return;
    }

    // Adiciona o novo usuário
    usuarios.push(usuario);

    // Salva no localStorage
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    // Mostra mensagem de sucesso
    alert("Cadastro realizado com sucesso!");

    // Limpa o formulário
    form.reset();
  });
});
document.getElementById("cep").addEventListener("blur", async () => {
  const cep = document.getElementById("cep").value.replace(/\D/g, "");
  if (cep.length === 8) {
    const resposta = await fetch(`https://brasilapi.com.br/api/cep/v1/${cep}`);
    if (resposta.ok) {
      const dados = await resposta.json();
      document.getElementById("logradouro").value = dados.street || "";
      document.getElementById("bairro").value = dados.neighborhood || "";
      document.getElementById("cidade").value = dados.city || "";
      document.getElementById("estado").value = dados.state || "";
    }
  }
});
const formCadastro = document.getElementById('form-cadastro');
const mensagem = document.getElementById('mensagem');

formCadastro.addEventListener('submit', function (e) {
  e.preventDefault();

  const nome = document.getElementById('nome').value.trim();
  const email = document.getElementById('email').value.trim();
  const senha = document.getElementById('senha').value.trim();

  if (!nome || !email || !senha) {
    exibirMensagem('Preencha todos os campos!', 'erro');
    return;
  }

  // Verifica se o e-mail já está cadastrado
  const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
  const existe = usuarios.find(u => u.email === email);

  if (existe) {
    exibirMensagem('E-mail já cadastrado!', 'erro');
    return;
  }

  // Salva o novo usuário
  usuarios.push({ nome, email, senha });
  localStorage.setItem('usuarios', JSON.stringify(usuarios));

  exibirMensagem('Cadastro realizado com sucesso! ✅', 'sucesso');

  setTimeout(() => {
    window.location.href = 'login.html';
  }, 1200);
});

function exibirMensagem(texto, tipo) {
  mensagem.textContent = texto;
  mensagem.className = tipo;
}

