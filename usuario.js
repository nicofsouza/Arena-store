document.addEventListener("DOMContentLoaded", () => {
  const userInfo = document.getElementById("nome-usuario");
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

  if (usuarioLogado) {
    userInfo.textContent = `Olá, ${usuarioLogado.nome}`;
  } else {
    userInfo.textContent = "";
  }
});
