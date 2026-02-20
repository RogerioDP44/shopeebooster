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
                        content: "Você é um especialista em SEO Shopee. Responda APENAS no formato: TITULO ### DESCRIÇÃO ### TAGS. Regras: 1. TITULO sem emojis. 2. DESCRIÇÃO com muitos emojis. 3. TAGS com #. Use ### para separar."
                    },
                    {
                        role: "user",
                        content: `Produto: ${nome}, Preço: R$ ${preco}`
                    }
                ],
                temperature: 0.7
            })
        });

        const data = await response.json();
        if (data.error) return res.status(500).json({ error: "Erro na API" });

        res.status(200).json(data.choices[0].message.content);
    } catch (e) {
        res.status(500).json({ error: "Erro interno" });
    }
}