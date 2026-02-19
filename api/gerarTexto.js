export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Método não permitido');
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
                        content: `Você é um robô especialista em vendas na Shopee Brasil.
                        REGRAS OBRIGATÓRIAS:
                        1. TÍTULO: Deve ser a primeira linha, em LETRAS MAIÚSCULAS, focado em SEO.
                        2. DESCRIÇÃO: Use MUITOS emojis (mínimo 15) como ✅, 🔥, 🚀, 📦, 💎, 💰.
                        3. ESTRUTURA: Título | Descrição com Emojis | Tags.
                        
                        FORMATO DE RESPOSTA (NUNCA MUDE ISSO):
                        TITULO_AQUI | DESCRICAO_AQUI | TAGS_AQUI`
                    },
                    {
                        role: "user",
                        content: `Gere um anúncio magnético com MUITOS EMOJIS para o produto: ${nome}, preço R$ ${preco}.`
                    }
                ],
                temperature: 0.9
            })
        });

        const data = await response.json();
        res.status(200).json(data.choices[0].message.content);
    } catch (error) {
        res.status(500).json("Erro ao conectar com a IA");
    }
}