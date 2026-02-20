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
                        content: "Você é um especialista em SEO Shopee Brasil. Responda seguindo RIGOROSAMENTE este formato: TITULO ### DESCRIÇÃO ### TAGS. Regras: 1. O TITULO deve ser apenas texto, SEM EMOJIS. 2. A DESCRIÇÃO deve ser vendedora e COM MUITOS EMOJIS. 3. As TAGS devem ser separadas por vírgula e com #. Use apenas ### como separador."
                    },
                    {
                        role: "user",
                        content: `Gere um anúncio para o produto: ${nome}, preço: R$ ${preco}`
                    }
                ],
                temperature: 0.7
            })
        });

        const data = await response.json();
        
        if (data.error) {
            return res.status(500).json({ error: "Erro na API da OpenAI" });
        }

        res.status(200).json(data.choices[0].message.content);

    } catch (e) {
        res.status(500).json({ error: "Erro interno no servidor" });
    }
}