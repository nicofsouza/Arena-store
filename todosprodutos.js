// FILTRO DE PRODUTOS
function filtrar(categoria) {
    const produtos = document.querySelectorAll('.produto');
    const botoes = document.querySelectorAll('.categorias button');

    botoes.forEach(btn => btn.classList.remove('ativo'));
    event.target.classList.add('ativo');

    produtos.forEach(item => {
        if (categoria === 'todos') {
            item.style.display = 'block';
        } else {
            item.style.display = item.classList.contains(categoria) ? 'block' : 'none';
        }
    });
}

// MOSTRAR NOME DO USUÁRIO LOGADO
const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));

if (usuario) {
    document.getElementById("nome-usuario").textContent = "👋 " + usuario.nome;
} else {
    document.getElementById("nome-usuario").textContent = "";
}
