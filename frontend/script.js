// Endereço do backend — onde a API está rodando
const API = 'http://localhost:8080/api/solicitacoes';

// Guarda o id da solicitação que estamos alterando o status
let solicitacaoAtualId = null;

// Regras de quais status são permitidos a partir de cada status atual
const transicoes = {
  SOLICITADO: ['LIBERADO', 'REJEITADO'],
  LIBERADO:   ['APROVADO', 'REJEITADO'],
  APROVADO:   ['CANCELADO'],
  REJEITADO:  [],
  CANCELADO:  []
};

// ─────────────────────────────────────────
// NAVEGAÇÃO ENTRE PÁGINAS
// ─────────────────────────────────────────
function showPage(id, btn) {
  // Esconde todas as páginas
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  // Remove o destaque de todos os botões do menu
  document.querySelectorAll('nav button').forEach(b => b.classList.remove('active'));
  // Mostra a página escolhida
  document.getElementById('page-' + id).classList.add('active');
  // Destaca o botão clicado
  btn.classList.add('active');
  // Se voltou para listagem, recarrega os dados
  if (id === 'listagem') carregarListagem();
}

// ─────────────────────────────────────────
// CARREGA SOLICITANTES E CATEGORIAS
// (usados nos selects de filtro e cadastro)
// ─────────────────────────────────────────
async function carregarAuxiliares() {
  const res  = await fetch(API + '/auxiliares');
  const data = await res.json();

  // Preenche o filtro de categorias
  const filtroCategoria = document.getElementById('filtro-categoria');
  data.categorias.forEach(c => {
    filtroCategoria.innerHTML += `<option value="${c.id}">${c.nome}</option>`;
  });

  // Preenche o select de solicitante no cadastro
  const cadSolicitante = document.getElementById('cad-solicitante');
  data.solicitantes.forEach(s => {
    cadSolicitante.innerHTML += `<option value="${s.id}">${s.nome}</option>`;
  });

  // Preenche o select de categoria no cadastro
  const cadCategoria = document.getElementById('cad-categoria');
  data.categorias.forEach(c => {
    cadCategoria.innerHTML += `<option value="${c.id}">${c.nome}</option>`;
  });
}

// ─────────────────────────────────────────
// LISTAGEM COM FILTROS
// ─────────────────────────────────────────
async function carregarListagem() {
  // Lê os valores dos filtros
  const status      = document.getElementById('filtro-status').value;
  const dataInicio  = document.getElementById('filtro-inicio').value;
  const dataFim     = document.getElementById('filtro-fim').value;
  const categoriaId = document.getElementById('filtro-categoria').value;

  // Monta a URL com os filtros preenchidos
  const params = new URLSearchParams();
  if (status)      params.append('status', status);
  if (dataInicio)  params.append('dataInicio', dataInicio);
  if (dataFim)     params.append('dataFim', dataFim);
  if (categoriaId) params.append('categoriaId', categoriaId);

  // Chama a API
  const res  = await fetch(`${API}?${params.toString()}`);
  const rows = await res.json();

  const tbody = document.getElementById('tabela-corpo');

  // Se não encontrou nada
  if (rows.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" class="empty">Nenhuma solicitação encontrada.</td></tr>';
    return;
  }

  // Monta as linhas da tabela
  tbody.innerHTML = rows.map(r => `
    <tr>
      <td>${r.id}</td>
      <td>${r.nomeSolicitante}</td>
      <td>${r.documentoSolicitante}</td>
      <td>${r.nomeCategoria}</td>
      <td>R$ ${parseFloat(r.valor).toFixed(2).replace('.', ',')}</td>
      <td>${r.dataSolicitacao}</td>
      <td><span class="badge badge-${r.status}">${r.status}</span></td>
      <td>
        <button class="btn-sm btn-detail" onclick="abrirDetalhe(${r.id})">Detalhe</button>
        ${transicoes[r.status].length > 0
          ? `<button class="btn-sm btn-status" onclick="abrirStatus(${r.id}, '${r.status}')">Status</button>`
          : ''}
      </td>
    </tr>
  `).join('');
}

// ─────────────────────────────────────────
// MODAL DETALHE
// ─────────────────────────────────────────
async function abrirDetalhe(id) {
  const res  = await fetch(`${API}/${id}`);
  const data = await res.json();

  document.getElementById('modal-conteudo').innerHTML = `
    <div class="detail-row">
      <span class="detail-label">ID</span>
      <span class="detail-value">${data.id}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Solicitante</span>
      <span class="detail-value">${data.solicitante.nome}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Documento</span>
      <span class="detail-value">${data.solicitante.cpfCnpj}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Categoria</span>
      <span class="detail-value">${data.categoria.nome}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Descrição</span>
      <span class="detail-value">${data.descricao}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Valor</span>
      <span class="detail-value">R$ ${parseFloat(data.valor).toFixed(2).replace('.', ',')}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Data</span>
      <span class="detail-value">${data.dataSolicitacao}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Status</span>
      <span class="detail-value">
        <span class="badge badge-${data.status}">${data.status}</span>
      </span>
    </div>
  `;

  document.getElementById('modal-detalhe').classList.add('open');
}

// ─────────────────────────────────────────
// MODAL ALTERAR STATUS
// ─────────────────────────────────────────
function abrirStatus(id, statusAtual) {
  solicitacaoAtualId = id;

  document.getElementById('status-info').textContent =
    `Solicitação #${id} — Status atual: ${statusAtual}`;

  // Mostra só os status permitidos para o status atual
  const select = document.getElementById('select-novo-status');
  select.innerHTML = transicoes[statusAtual]
    .map(s => `<option value="${s}">${s}</option>`)
    .join('');

  document.getElementById('alerta-status').innerHTML = '';
  document.getElementById('modal-status').classList.add('open');
}

async function confirmarStatus() {
  const novoStatus = document.getElementById('select-novo-status').value;

  const res = await fetch(`${API}/${solicitacaoAtualId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: novoStatus })
  });

  const data = await res.json();

  if (res.ok) {
    fecharModal('modal-status');
    carregarListagem(); // Atualiza a tabela
  } else {
    document.getElementById('alerta-status').innerHTML =
      `<div class="alert alert-error">${data.erro}</div>`;
  }
}

// ─────────────────────────────────────────
// CADASTRO DE NOVA SOLICITAÇÃO
// ─────────────────────────────────────────
async function cadastrar() {
  const body = {
    solicitanteId: document.getElementById('cad-solicitante').value,
    categoriaId:   document.getElementById('cad-categoria').value,
    descricao:     document.getElementById('cad-descricao').value.trim(),
    valor:         document.getElementById('cad-valor').value
  };

  // Validação básica
  if (!body.descricao || !body.valor) {
    document.getElementById('alerta-cadastro').innerHTML =
      `<div class="alert alert-error">Preencha todos os campos obrigatórios.</div>`;
    return;
  }

  const res  = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  const data = await res.json();

  if (res.ok) {
    document.getElementById('alerta-cadastro').innerHTML =
      `<div class="alert alert-success">✅ Solicitação #${data.id} cadastrada com sucesso!</div>`;
    // Limpa os campos após salvar
    document.getElementById('cad-descricao').value = '';
    document.getElementById('cad-valor').value = '';
  } else {
    document.getElementById('alerta-cadastro').innerHTML =
      `<div class="alert alert-error">❌ ${data.erro}</div>`;
  }
}

// ─────────────────────────────────────────
// FECHAR MODAL
// ─────────────────────────────────────────
function fecharModal(id) {
  document.getElementById(id).classList.remove('open');
}

// ─────────────────────────────────────────
// INICIALIZAÇÃO — roda quando a página abre
// ─────────────────────────────────────────
carregarAuxiliares();
carregarListagem();