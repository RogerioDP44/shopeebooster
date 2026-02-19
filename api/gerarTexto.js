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
                        content: `Você é um Especialista em SEO para Shopee Brasil.
                        SUA RESPOSTA DEVE SER NO FORMATO: TITULO | DESCRIÇÃO | TAGS

                        REGRAS RÍGIDAS:
                        1. TÍTULO: Máximo 80 caracteres. Deve começar com a palavra-chave mais buscada. Use: [Produto] + [Atributo] + [Diferencial]. Ex: "Toalha De Banho Gigante Algodão Macia Pronta Entrega".
                        2. DESCRIÇÃO: Use muitos emojis (✅, 🔥, 🚀) e organize em tópicos.
                        3. FORMATO: Responda apenas com as 3 partes separadas por "|".`
                    },
                    {
                        role: "user",
                        content: `Gere um anúncio de alta conversão para: ${nome}, preço R$ ${preco}.`
                    }
                ],
                temperature: 0.7
            })
        });

        const data = await response.json();
        res.status(200).json(data.choices[0].message.content);
    } catch (error) {
        res.status(500).json("Erro na conexão com a IA");
    }
}