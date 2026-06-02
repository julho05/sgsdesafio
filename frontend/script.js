const API = 'http://localhost:8080/api/solicitacoes';

let solicitacaoAtualId = null;

// Status permitidos para cada transição
const transicoes = {
  SOLICITADO: ['LIBERADO', 'REJEITADO'],
  LIBERADO:   ['APROVADO', 'REJEITADO'],
  APROVADO:   ['CANCELADO'],
  REJEITADO:  [],
  CANCELADO:  []
};

// Troca a página ativa no menu
function showPage(id, btn) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('nav button').forEach(b => b.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');
  btn.classList.add('active');
  if (id === 'listagem') carregarListagem();
}

// Carrega solicitantes e categorias para os selects
async function carregarAuxiliares() {
  const res  = await fetch(API + '/auxiliares');
  const data = await res.json();

  const filtroCategoria = document.getElementById('filtro-categoria');
  data.categorias.forEach(c => {
    filtroCategoria.innerHTML += `<option value="${c.id}">${c.nome}</option>`;
  });

  const cadSolicitante = document.getElementById('cad-solicitante');
  data.solicitantes.forEach(s => {
    cadSolicitante.innerHTML += `<option value="${s.id}">${s.nome}</option>`;
  });

  const cadCategoria = document.getElementById('cad-categoria');
  data.categorias.forEach(c => {
    cadCategoria.innerHTML += `<option value="${c.id}">${c.nome}</option>`;
  });
}

// Busca as solicitações aplicando os filtros selecionados
async function carregarListagem() {
  const status      = document.getElementById('filtro-status').value;
  const dataInicio  = document.getElementById('filtro-inicio').value;
  const dataFim     = document.getElementById('filtro-fim').value;
  const categoriaId = document.getElementById('filtro-categoria').value;

  const params = new URLSearchParams();
  if (status)      params.append('status', status);
  if (dataInicio)  params.append('dataInicio', dataInicio);
  if (dataFim)     params.append('dataFim', dataFim);
  if (categoriaId) params.append('categoriaId', categoriaId);

  const res  = await fetch(`${API}?${params.toString()}`);
  const rows = await res.json();

  const tbody = document.getElementById('tabela-corpo');

  if (rows.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" class="empty">Nenhuma solicitação encontrada.</td></tr>';
    return;
  }

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

// Abre o modal com os detalhes da solicitação
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

// Abre o modal para alterar o status
function abrirStatus(id, statusAtual) {
  solicitacaoAtualId = id;

  document.getElementById('status-info').textContent =
    `Solicitação #${id} — Status atual: ${statusAtual}`;

  // Mostra apenas os status permitidos para o status atual
  const select = document.getElementById('select-novo-status');
  select.innerHTML = transicoes[statusAtual]
    .map(s => `<option value="${s}">${s}</option>`)
    .join('');

  document.getElementById('alerta-status').innerHTML = '';
  document.getElementById('modal-status').classList.add('open');
}

// Confirma a alteração de status
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
    carregarListagem();
  } else {
    document.getElementById('alerta-status').innerHTML =
      `<div class="alert alert-error">${data.erro}</div>`;
  }
}

// Cadastra uma nova solicitação
async function cadastrar() {
  const body = {
    solicitanteId: document.getElementById('cad-solicitante').value,
    categoriaId:   document.getElementById('cad-categoria').value,
    descricao:     document.getElementById('cad-descricao').value.trim(),
    valor:         document.getElementById('cad-valor').value
  };

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
    document.getElementById('cad-descricao').value = '';
    document.getElementById('cad-valor').value = '';
  } else {
    document.getElementById('alerta-cadastro').innerHTML =
      `<div class="alert alert-error">❌ ${data.erro}</div>`;
  }
}

// Fecha o modal pelo id
function fecharModal(id) {
  document.getElementById(id).classList.remove('open');
}

// Inicialização
carregarAuxiliares();
carregarListagem();