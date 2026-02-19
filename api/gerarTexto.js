export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });
    
    const { nome, preco } = req.body;

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: `Você é um Especialista em SEO de Elite para Shopee Brasil. Sua tarefa é transformar nomes simples de produtos em anúncios profissionais que dominam a busca orgânica.

                        REGRAS PARA O TÍTULO (Obrigatório):
                        - NÃO USE EMOJIS NO TÍTULO.
                        - Limite: Máximo 80 caracteres.
                        - Estrutura: [Palavra-Chave Principal] + [Atributos/Especificações] + [Diferenciais de Venda].
                        - Se o cliente digitar apenas "Fone", você deve criar algo como: "Fone De Ouvido Bluetooth Sem Fio Recarregável Original Pronta Entrega".
                        - Use termos de alto volume: Original, Premium, Oferta, Envio Imediato, Full.

                        REGRAS PARA A DESCRIÇÃO:
                        - Use MUITOS EMOJIS (✅, 🔥, 🚀, 📦, 💎).
                        - Crie uma copy persuasiva que destaque os benefícios para o comprador.

                        REGRAS PARA AS TAGS:
                        - Gere 10 hashtags estratégicas focadas no algoritmo da Shopee.

                        FORMATO DA RESPOSTA (Siga rigorosamente):
                        TITULO_AQUI | DESCRICAO_AQUI | TAGS_AQUI`
                    },
                    {
                        role: "user",
                        content: `O cliente digitou o produto: "${nome}". O preço é R$ ${preco}. Crie o anúncio de elite para ranqueamento.`
                    }
                ],
                temperature: 0.8
            })
        });

        const data = await response.json();
        res.setHeader('Cache-Control', 'no-store'); // Evita que o navegador mostre resultado antigo
        res.status(200).json(data.choices[0].message.content);

    } catch (error) {
        res.status(500).json("Erro ao conectar com a IA");
    }
}