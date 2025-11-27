document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-cadastro");
  const mensagem = document.getElementById("mensagem");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const telefone = document.getElementById("telefone").value.trim();
    const senha = document.getElementById("senha").value.trim();
    const cep = document.getElementById("cep").value.trim();
    const logradouro = document.getElementById("logradouro").value.trim();
    const bairro = document.getElementById("bairro").value.trim();
    const cidade = document.getElementById("cidade").value.trim();
    const estado = document.getElementById("estado").value.trim();

    // validação
    if (!nome || !email || !senha) {
      exibirMensagem("Preencha os campos obrigatórios!", "erro");
      return;
    }

    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const existe = usuarios.find(u => u.email === email);

    if (existe) {
      exibirMensagem("E-mail já cadastrado!", "erro");
      return;
    }

    // salva tudo (com CEP)
    usuarios.push({
      nome,
      email,
      telefone,
      senha,
      cep,
      logradouro,
      bairro,
      cidade,
      estado
    });

    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    exibirMensagem("Cadastro realizado com sucesso! ✅", "sucesso");

    setTimeout(() => {
      window.location.href = "login.html";
    }, 1200);
  });

  // -------------------------------
  // 🚀 API VIA CEP — FUNCIONANDO
  // -------------------------------
  document.getElementById("cep").addEventListener("blur", async () => {
    const cep = document.getElementById("cep").value.replace(/\D/g, "");

    if (cep.length !== 8) {
      exibirMensagem("CEP inválido!", "erro");
      return;
    }

    try {
      const resp = await fetch(`https://viacep.com.br/ws/${cep}/json/`);

      if (!resp.ok) {
        exibirMensagem("Erro ao buscar CEP!", "erro");
        return;
      }

      const dados = await resp.json();

      if (dados.erro) {
        exibirMensagem("CEP não encontrado!", "erro");
        return;
      }

      // Preenche automaticamente no formulário
      document.getElementById("logradouro").value = dados.logradouro || "";
      document.getElementById("bairro").value = dados.bairro || "";
      document.getElementById("cidade").value = dados.localidade || "";
      document.getElementById("estado").value = dados.uf || "";

      mensagem.textContent = "";
      
    } catch (erro) {
      exibirMensagem("Erro ao consultar CEP!", "erro");
    }
  });

  function exibirMensagem(texto, tipo) {
    mensagem.textContent = texto;
    mensagem.className = tipo;
  }
});
