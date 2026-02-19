// CONFIGURAÇÃO SUPABASE (Pegue no seu painel Supabase)
const supabaseUrl = 'https://amseupdyzghcypepohsy.supabase.co';
const supabaseKey = 'sb_publishable_YwI94XF8jz2KmvaLrwJ57A_TH-pENRN';
const _supabase = supabase.createClient(supabaseUrl, supabaseKey);

async function calcularEGerar() {
    const { data: { session } } = await _supabase.auth.getSession();
    if (!session) return window.location.href = 'login.html';

    const nome = document.getElementById('nome').value;
    const custo = parseFloat(document.getElementById('custo').value) || 0;
    const embalagem = parseFloat(document.getElementById('embalagem').value) || 0;
    const margem = (parseFloat(document.getElementById('margem').value) || 0) / 100;
    const imposto = (parseFloat(document.getElementById('imposto').value) || 0) / 100;
    const comFrete = document.getElementById('freteGratis').checked;

    if (!nome || custo <= 0) return alert("Preencha o nome e o custo!");

    // REGRAS OFICIAIS 2026 CONFORME TABELA
    let estPV = (custo + embalagem) * 1.5;
    let comissaoBase = 0.14; 
    let taxaFixa = 26.00;
    let subsidioPix = 0.05;

    // Lógica de Faixas
    if (estPV < 80) { comissaoBase = 0.20; taxaFixa = 4.00; subsidioPix = 0; }
    else if (estPV < 100) { taxaFixa = 16.00; }
    else if (estPV < 200) { taxaFixa = 20.00; }
    else if (estPV >= 500) { subsidioPix = 0.08; }

    let comissaoFinal = comFrete ? (comissaoBase + 0.06) : comissaoBase;
    let divisor = (1 - comissaoFinal - margem - imposto);
    
    if (divisor <= 0) return alert("As taxas somadas ultrapassam 100%!");
    
    let precoVenda = (custo + embalagem + taxaFixa) / divisor;

    document.getElementById('resPreco').innerText = `R$ ${precoVenda.toFixed(2)}`;
    
    let vNormal = (precoVenda * comissaoFinal) + taxaFixa;
    let vPix = (precoVenda * (comissaoFinal - subsidioPix)) + taxaFixa;
    let vImposto = precoVenda * imposto;

    document.getElementById('resLucro').innerText = `R$ ${(precoVenda - vNormal - custo - embalagem - vImposto).toFixed(2)}`;
    document.getElementById('resLucroPix').innerText = `R$ ${(precoVenda - vPix - custo - embalagem - vImposto).toFixed(2)}`;

    acionarIA(nome, precoVenda.toFixed(2));
}

async function acionarIA(nome, preco) {
    document.getElementById('resTitulo').innerText = "IA GERANDO... 🔥";
    try {
        const response = await fetch('/api/gerarTexto', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, preco })
        });
        const data = await response.json();
        let partes = data.split('|').map(p => p.trim());
        document.getElementById('resTitulo').innerText = (partes[0] || "").toUpperCase();
        document.getElementById('resDescricao').innerText = partes[1] || "";
        document.getElementById('resTags').innerText = partes[2] || "";
    } catch (e) { document.getElementById('resTitulo').innerText = "ERRO NA API"; }
}

async function fazerLogout() {
    await _supabase.auth.signOut();
    window.location.href = 'login.html';
}