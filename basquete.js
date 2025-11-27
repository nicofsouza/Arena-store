function filtrar(categoria) {
    const produtos = document.querySelectorAll(".produto");
    const botoes = document.querySelectorAll(".categorias button");

    botoes.forEach(btn => btn.classList.remove("ativo"));
    event.target.classList.add("ativo");

    produtos.forEach(prod => {
        if (categoria === "todos") {
            prod.style.display = "block";
        } else if (prod.classList.contains(categoria)) {
            prod.style.display = "block";
        } else {
            prod.style.display = "none";
        }
    });
}

function rolarParaProdutos() {
    document.getElementById("produtos").scrollIntoView({
        behavior: "smooth"
    });
}
