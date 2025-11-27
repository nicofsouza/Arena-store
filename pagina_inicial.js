document.addEventListener("DOMContentLoaded", () => {
  const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
  const headerRight = document.querySelector(".header-right");

  // Mostrar nome do usuário logado
  if (usuario) {
    headerRight.innerHTML = `
      <span>Olá, <strong>${usuario.nome.split(' ')[0]}</strong>!</span>
      <button id="logout">Sair</button>
    `;

    document.getElementById("logout").addEventListener("click", () => {
      localStorage.removeItem("usuarioLogado");
      window.location.href = "login.html";
    });
  }

  // Ação dos botões de compra
  document.querySelectorAll(".card button").forEach(btn => {
    btn.addEventListener("click", () => {
      alert("Produto adicionado ao carrinho! 🛒");
    });
  });

  // Carrossel automático
  const linhas = document.querySelectorAll(".linha-produtos");
  linhas.forEach(linha => {
    let scroll = 0;
    setInterval(() => {
      scroll += 1;
      if (scroll >= linha.scrollWidth - linha.clientWidth) scroll = 0;
      linha.scrollTo({ left: scroll, behavior: "smooth" });
    }, 50);
  });
});

function carregarProdutos() {
    let produtos = JSON.parse(localStorage.getItem("produtos")) || [];

    let container = document.getElementById("produtos");
    container.innerHTML = "";

    produtos.forEach(produto => {
        container.innerHTML += `
            <div class="produto-card">
                <img src="${produto.imagem}" alt="${produto.nome}">
                <h3>${produto.nome}</h3>
                <p>R$ ${produto.preco}</p>
            </div>
        `;
    });
}

carregarProdutos();
