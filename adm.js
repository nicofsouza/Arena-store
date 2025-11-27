// Mudar telas do painel
function mostrarTela(id) {
    document.querySelectorAll('.tela').forEach(t => t.classList.remove('ativa'));
    document.getElementById(id).classList.add('ativa');
}

// Carregar produtos salvos
let produtos = JSON.parse(localStorage.getItem("produtosLoja")) || [];

// Atualizar dados do dashboard
function atualizarDashboard() {
    document.getElementById("total-produtos").textContent = produtos.length;

    let estoqueTotal = produtos.reduce((soma, p) => soma + Number(p.estoque), 0);
    document.getElementById("estoque-total").textContent = estoqueTotal;

    document.getElementById("vendas-hoje").textContent = 0; // futuro sistema
}

atualizarDashboard();

// Listar produtos na tabela
function carregarTabela() {
    const tbody = document.getElementById("lista-produtos");
    tbody.innerHTML = "";

    produtos.forEach((p, index) => {
        tbody.innerHTML += `
            <tr>
                <td><img src="${p.imagem}" width="60"></td>
                <td>${p.nome}</td>
                <td>R$ ${p.preco}</td>
                <td>${p.estoque}</td>
                <td>${p.categoria}</td>
                <td>${p.esporte}</td>
                <td>
                    <button onclick="editarProduto(${index})">✏ Editar</button>
                    <button onclick="removerProduto(${index})">🗑 Remover</button>
                </td>
            </tr>
        `;
    });
}

carregarTabela();

// Criar produto
document.getElementById("form-produto").addEventListener("submit", function (e) {
    e.preventDefault();

    let imagemFile = document.getElementById("imagem").files[0];

    let leitor = new FileReader();
    leitor.onload = function () {

        const novoProduto = {
            nome: document.getElementById("nome").value,
            preco: document.getElementById("preco").value,
            estoque: document.getElementById("estoque").value,
            categoria: document.getElementById("categoria").value,
            esporte: document.getElementById("esporte").value,
            imagem: leitor.result
        };

        produtos.push(novoProduto);
        localStorage.setItem("produtosLoja", JSON.stringify(produtos));

        alert("Produto criado com sucesso!");
        carregarTabela();
        atualizarDashboard();
        document.getElementById("form-produto").reset();
    };

    if (imagemFile) {
        leitor.readAsDataURL(imagemFile);
    }
});

// Remover produto
function removerProduto(index) {
    if (confirm("Deseja remover este produto?")) {
        produtos.splice(index, 1);
        localStorage.setItem("produtosLoja", JSON.stringify(produtos));
        carregarTabela();
        atualizarDashboard();
    }
}

// Editar produto
function editarProduto(index) {
    const p = produtos[index];

    document.getElementById("nome").value = p.nome;
    document.getElementById("preco").value = p.preco;
    document.getElementById("estoque").value = p.estoque;
    document.getElementById("categoria").value = p.categoria;
    document.getElementById("esporte").value = p.esporte;

    mostrarTela("novo-produto");

    removerProduto(index); // remove e salva novamente ao enviar
}
document.getElementById("form-produto").addEventListener("submit", function (e) {
    e.preventDefault();

    let nome = document.getElementById("nome").value;
    let preco = document.getElementById("preco").value;
    let estoque = document.getElementById("estoque").value;
    let categoria = document.getElementById("categoria").value;
    let esporte = document.getElementById("esporte").value;
    let imagemInput = document.getElementById("imagem");

    let imagemURL = "";
    if (imagemInput.files.length > 0) {
        imagemURL = URL.createObjectURL(imagemInput.files[0]); // salva a imagem temporária
    }

    let produtos = JSON.parse(localStorage.getItem("produtos")) || [];

    produtos.push({
        id: Date.now(),
        nome,
        preco,
        estoque,
        categoria,
        esporte,
        imagem: imagemURL
    });

    localStorage.setItem("produtos", JSON.stringify(produtos));

    alert("Produto salvo com sucesso!");
    this.reset();
});



