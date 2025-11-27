/* carrinho.js
  Regras:
  - O carrinho é salvo em localStorage na chave "carrinhoArena"
  - Ao clicar em "Comprar" em qualquer página você deve adicionar o produto (ver trecho de integração abaixo)
*/

// Utilitários
const $ = (sel) => document.querySelector(sel);
const fmt = (n) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

/* CARREGAMENTO INICIAL */
document.addEventListener('DOMContentLoaded', () => {
  atualizarBadge();
  renderCarrinho();
  document.getElementById('calcular-frete').addEventListener('click', calcularFretePeloCep);
  document.getElementById('finalizar').addEventListener('click', finalizarCompra);
  // atualiza UI forma pagamento
  document.querySelectorAll('input[name="pag"]').forEach(r => r.addEventListener('change', mostrarCamposPagamento));
  mostrarCamposPagamento();
  // mostrar nome do usuário se logado
  const user = JSON.parse(localStorage.getItem('usuarioLogado'));
  if(user) {
    const el = document.getElementById('nome-usuario-header') || document.getElementById('nome-usuario');
    if(el) el.textContent = `Olá, ${user.nome.split(' ')[0]}`;
  }
});

/* CARRINHO helpers */
function getCarrinho() {
  return JSON.parse(localStorage.getItem('carrinhoArena')) || [];
}
function setCarrinho(c) {
  localStorage.setItem('carrinhoArena', JSON.stringify(c));
  atualizarBadge();
}

/* Atualiza badge do carrinho */
function atualizarBadge() {
  const count = getCarrinho().reduce((s, it) => s + Number(it.quantidade || 1), 0);
  const badges = document.querySelectorAll('#badge-carrinho, #badge-carrinho-header');
  badges.forEach(b => b && (b.textContent = count));
}

/* Renderiza itens na página */
function renderCarrinho() {
  const container = document.getElementById('itens-carrinho');
  container.innerHTML = '';
  const carrinho = getCarrinho();
  if (carrinho.length === 0) {
    container.innerHTML = '<p>Seu carrinho está vazio. <a href="Pagina_inicial.html">Continuar comprando</a></p>';
    atualizarTotais();
    return;
  }

  const tpl = document.getElementById('template-item');
  carrinho.forEach((item, idx) => {
    const node = tpl.content.cloneNode(true);
    node.querySelector('.item-img').src = item.imagem || 'logo.png';
    node.querySelector('.item-img').alt = item.nome;
    node.querySelector('.item-nome').textContent = item.nome;
    node.querySelector('.item-preco').textContent = fmt(Number(item.preco) || 0);
    const qInput = node.querySelector('.q-input');
    qInput.value = item.quantidade || 1;
    node.querySelector('.item-total').textContent = fmt( (Number(item.preco)||0) * (Number(item.quantidade)||1) );

    // aumentar
    node.querySelector('.q-increase').addEventListener('click', () => {
      item.quantidade = Number(item.quantidade || 1) + 1;
      setCarrinho(carrinho);
      renderCarrinho();
    });
    // diminuir
    node.querySelector('.q-decrease').addEventListener('click', () => {
      item.quantidade = Math.max(1, Number(item.quantidade || 1) - 1);
      setCarrinho(carrinho);
      renderCarrinho();
    });
    // input direto
    qInput.addEventListener('change', (e) => {
      const v = Math.max(1, Number(e.target.value || 1));
      item.quantidade = v;
      setCarrinho(carrinho);
      renderCarrinho();
    });
    // remover
    node.querySelector('.remover').addEventListener('click', () => {
      if (!confirm('Remover este produto do carrinho?')) return;
      carrinho.splice(idx, 1);
      setCarrinho(carrinho);
      renderCarrinho();
    });

    container.appendChild(node);
  });

  atualizarTotais();
}

/* Totais */
function atualizarTotais() {
  const carrinho = getCarrinho();
  const subtotal = carrinho.reduce((s, i) => s + (Number(i.preco)||0) * (Number(i.quantidade)||1), 0);
  document.getElementById('subtotal').textContent = fmt(subtotal);

  const frete = Number(localStorage.getItem('freteArena') || 0);
  document.getElementById('valor-frete').textContent = fmt(frete);

  document.getElementById('total-geral').textContent = fmt(subtotal + frete);
}

/* ADICIONAR PRODUTO — função pública que você chama ao clicar em "Comprar" */
function adicionarAoCarrinho(prod) {
  // prod = { id, nome, preco, imagem, categoria, esporte }
  const carrinho = getCarrinho();
  const existente = carrinho.find(p => p.id === prod.id);
  if (existente) {
    existente.quantidade = Number(existente.quantidade || 1) + 1;
  } else {
    carrinho.push({...prod, quantidade: 1});
  }
  setCarrinho(carrinho);
  // abrir carrinho
  window.location.href = 'carrinho.html';
}

/* FRETE: busca endereço via ViaCEP e calcula frete simulado por estado */
async function calcularFretePeloCep() {
  const cepRaw = document.getElementById('cep-cart').value.replace(/\D/g, '');
  const info = document.getElementById('frete-info');
  info.textContent = '';
  if (cepRaw.length !== 8) {
    info.textContent = 'CEP inválido';
    return;
  }

  try {
    const resp = await fetch(`https://viacep.com.br/ws/${cepRaw}/json/`);
    if (!resp.ok) throw new Error('Erro na busca do CEP');
    const dados = await resp.json();
    if (dados.erro) { info.textContent = 'CEP não encontrado'; return; }
    // calcula frete com base no UF (simulação)
    const uf = dados.uf || 'SP';
    const frete = estimarFretePorEstado(uf);
    localStorage.setItem('freteArena', frete);
    info.textContent = `Endereço: ${dados.logradouro || ''}, ${dados.localidade} - ${uf}`;
    atualizarTotais();
  } catch (err) {
    info.textContent = 'Erro ao consultar CEP';
  }
}

/* Estimativa simples — substitua por API real de transportadora se precisar */
function estimarFretePorEstado(uf) {
  const zona = {
    'SP': 12, 'RJ': 15, 'MG': 15, 'ES': 15,
    'PR': 18, 'SC': 18, 'RS': 18,
    'BA': 25, 'PE': 25, 'CE': 25, 'PB': 25, 'RN': 25, 'AL': 25, 'SE': 25, 'PI': 25,
    'AM': 40, 'PA': 40, 'RO': 40, 'AC': 40, 'RR': 40, 'AP': 40, 'TO': 40,
    'GO': 22, 'MT': 28, 'MS': 28, 'DF': 22
  };
  return zona[uf] !== undefined ? zona[uf] : 30;
}

/* PAGAMENTO - exibe campos conforme método */
function mostrarCamposPagamento() {
  const sel = document.querySelector('input[name="pag"]:checked').value;
  const box = document.getElementById('pagamento-detalhes');
  box.innerHTML = '';
  if (sel === 'credito') {
    box.innerHTML = `
      <label>Número do cartão</label>
      <input id="card-number" placeholder="0000 0000 0000 0000" />
      <label>Validade</label>
      <input id="card-exp" placeholder="MM/AA" />
      <label>CVV</label>
      <input id="card-cvv" placeholder="123" />
    `;
  } else if (sel === 'debito') {
    box.innerHTML = `
      <label>Número do cartão</label>
      <input id="card-number" placeholder="0000 0000 0000 0000" />
      <label>Senha (simulada)</label>
      <input id="card-pin" placeholder="****" />
    `;
  } else {
    box.innerHTML = `
      <p>PIX selecionado — será exibido um QR code / chave PIX na finalização (simulado).</p>
    `;
  }
}


/* Finalizar compra (simulado) */
function finalizarCompra() {
  const carrinho = getCarrinho();
  
  // --- A LINHA ABAIXO É A TRAVA. ---
  // Eu adicionei "//" na frente para desativar ela. 
  // Agora o botão vai funcionar mesmo vazio.
  
  // if (carrinho.length === 0) { alert('Carrinho vazio'); return; }

  // validações (simples)
  const metodoInput = document.querySelector('input[name="pag"]:checked');
  const metodo = metodoInput ? metodoInput.value : '';
  
  if (metodo === 'credito') {
    // pode checar campos do cartão aqui...
  }

  // aqui você faria a integração com gateway de pagamento
  alert('Compra finalizada com sucesso! Obrigado pela preferência.');

  // limpar carrinho e frete
  localStorage.removeItem('carrinhoArena');
  localStorage.removeItem('freteArena');
  atualizarBadge();
  window.location.href = 'Pagina_inicial.html';
}
