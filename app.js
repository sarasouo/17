let vendas = [];
let gastos = [];
let fiados = [];

// Função para obter o ID do usuário logado (mock para exemplo)
function getUsuarioId() {
    // No backend real, você deve obter o ID do usuário autenticado
    // Aqui, para exemplo, vamos usar 'admin' (ajuste conforme seu backend)
    return 'admin';
}

// Integração com backend para registro de vendas/gastos
async function registrarVendaOuGasto(descricao, valor, tipo) {
    const registro = {
        descricao,
        valor,
        data: new Date().toISOString(),
        usuario: { nome: getUsuarioId() }
    };
    const url = tipo === 'venda' ? 'http://localhost:8080/api/vendas' : 'http://localhost:8080/api/gastos';
    const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registro)
    });
    if (!resp.ok) {
        let backendMsg = '';
        try {
            const errJson = await resp.json();
            backendMsg = errJson.message || JSON.stringify(errJson);
        } catch {
            backendMsg = await resp.text();
        }
        console.error('Erro do backend:', backendMsg);
        throw new Error(`Status: ${resp.status}. Resposta: ${backendMsg}`);
    }
}

// Integração com backend para registro de fiados
async function registrarFiado(nome, valor) {
    const registro = {
        nomeCliente: nome,
        valor,
        data: new Date().toISOString(),
        usuario: { nome: getUsuarioId() }
    };
    const url = 'http://localhost:8080/api/fiados';
    const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registro)
    });
    if (!resp.ok) {
        let backendMsg = '';
        try {
            const errJson = await resp.json();
            backendMsg = errJson.message || JSON.stringify(errJson);
        } catch {
            backendMsg = await resp.text();
        }
        console.error('Erro do backend:', backendMsg);
        throw new Error(`Status: ${resp.status}. Resposta: ${backendMsg}`);
    }
}

// Atualiza vendas/gastos/fiados a partir do backend
async function carregarDados() {
    const usuarioId = getUsuarioId();
    const vendasResp = await fetch(`http://localhost:8080/api/vendas/usuario/${usuarioId}`);
    vendas = vendasResp.ok ? await vendasResp.json() : [];
    const gastosResp = await fetch(`http://localhost:8080/api/gastos/usuario/${usuarioId}`);
    gastos = gastosResp.ok ? await gastosResp.json() : [];
    const fiadosResp = await fetch(`http://localhost:8080/api/fiados/usuario/${usuarioId}`);
    fiados = fiadosResp.ok ? await fiadosResp.json() : [];
}

// Formulário registro vendas e gastos
document.getElementById('form-registro').addEventListener('submit', async function(event) {
    event.preventDefault();
    const descricao = document.getElementById('descricao').value.trim();
    const valor = parseFloat(document.getElementById('valor').value);
    const tipo = document.getElementById('tipo').value;
    if (!descricao || isNaN(valor) || valor <= 0) {
        alert('Preencha a descrição e um valor válido maior que zero.');
        return;
    }
    try {
        await registrarVendaOuGasto(descricao, valor, tipo);
        await carregarDados();
        atualizarRelatorios();
        this.reset();
    } catch (err) {
        alert('Erro ao registrar: ' + err.message);
    }
});

// Formulário registro fiados
document.getElementById('form-fiado').addEventListener('submit', async function(event) {
    event.preventDefault();
    const nome = document.getElementById('nome-fiado').value.trim();
    const valor = parseFloat(document.getElementById('valor-fiado').value);
    if (!nome || isNaN(valor) || valor <= 0) {
        alert('Preencha o nome do cliente e um valor válido maior que zero.');
        return;
    }
    try {
        await registrarFiado(nome, valor);
        await carregarDados();
        this.reset();
    } catch (err) {
        alert('Erro ao registrar fiado: ' + err.message);
    }
});

// Atualizar relatórios agora usa os dados carregados do backend
function atualizarRelatorios() {
    const totalVendas = vendas.reduce((acc, v) => acc + v.valor, 0);
    const totalGastos = gastos.reduce((acc, g) => acc + g.valor, 0);
    const lucro = totalVendas - totalGastos;
    document.getElementById('relatorio-vendas').innerText = `Total de Vendas: R$ ${totalVendas.toFixed(2)}`;
    document.getElementById('relatorio-gastos').innerText = `Total de Gastos: R$ ${totalGastos.toFixed(2)}`;
    document.getElementById('relatorio-lucro').innerText = `Lucro: R$ ${lucro.toFixed(2)}`;
    atualizarResumoDia();
}

// Adiciona função para atualizar o resumo do dia
function atualizarResumoDia() {
    const resumoDiaEl = document.getElementById('resumo-dia');
    const hojeStr = new Date().toISOString().slice(0,10);
    const vendasHoje = vendas.filter(v => v.data && v.data.startsWith(hojeStr));
    const gastosHoje = gastos.filter(g => g.data && g.data.startsWith(hojeStr));
    const totalVendasHoje = vendasHoje.reduce((acc, v) => acc + v.valor, 0);
    const totalGastosHoje = gastosHoje.reduce((acc, g) => acc + g.valor, 0);
    const lucroHoje = totalVendasHoje - totalGastosHoje;
    resumoDiaEl.innerHTML = `
      <p>Vendas: <strong>R$ ${totalVendasHoje.toFixed(2)}</strong></p>
      <p>Gastos: <strong>R$ ${totalGastosHoje.toFixed(2)}</strong></p>
      <p>Lucro: <strong>R$ ${lucroHoje.toFixed(2)}</strong></p>
    `;
}

// Carregar dados ao iniciar
carregarDados().then(atualizarRelatorios);