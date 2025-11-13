// ============================
// VALIDAÇÃO DE LOGIN SIMPLES
// ============================

// Captura o formulário e os campos
const form = document.getElementById('form-login');
const email = document.getElementById('email');
const senha = document.getElementById('senha');
const mensagem = document.getElementById('mensagem');

// Simulação de usuário cadastrado (pode ser substituído depois por backend)
const usuarioFake = {
  email: 'teste@exemplo.com',
  senha: '123456'
};

// Evento de envio do formulário
form.addEventListener('submit', function (e) {
  e.preventDefault(); // impede o envio automático

  // Verifica se os campos estão preenchidos
  if (email.value.trim() === '' || senha.value.trim() === '') {
    exibirMensagem('Por favor, preencha todos os campos!', 'erro');
    return;
  }

  // Verifica login
  if (email.value === usuarioFake.email && senha.value === usuarioFake.senha) {
    exibirMensagem('Login realizado com sucesso! ✅', 'sucesso');

    // redirecionar (exemplo)
    setTimeout(() => {
      window.location.href = 'pagina_inicial.html';
    }, 1000);
  } else {
    exibirMensagem('E-mail ou senha incorretos!', 'erro');
  }
});

// Função para exibir mensagens
function exibirMensagem(texto, tipo) {
  mensagem.textContent = texto;
  mensagem.className = tipo; // muda a classe (sucesso ou erro)
}
