function filtrar(categoria) {
    const produtos = document.querySelectorAll('.produto');
    const botoes = document.querySelectorAll('.categorias button');

    botoes.forEach(btn => btn.classList.remove('ativo'));
    event.target.classList.add('ativo');

    produtos.forEach(produto => {
        if (categoria === 'todos') {
            produto.style.display = 'block';
        } else {
            produto.style.display = produto.classList.contains(categoria) ? 'block' : 'none';
        }
    });
}

function rolarParaProdutos() {
    document.getElementById('produtos').scrollIntoView({ behavior: 'smooth' });
}
