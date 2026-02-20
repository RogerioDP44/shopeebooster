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
                        content: "Você é um especialista em SEO para Shopee Brasil. Responda seguindo exatamente este formato: TITULO ### DESCRIÇÃO ### TAGS. Regras críticas: 1. O TITULO deve ser focado em palavras-chave e NUNCA conter emojis. 2. A DESCRIÇÃO deve ser vendedora e conter muitos emojis. 3. As TAGS devem ser precedidas por #. Use apenas ### como separador."
                    },
                    {
                        role: "user",
                        content: `Gere um anúncio para o produto: ${nome}, que custa R$ ${preco}.`
                    }
                ],
                temperature: 0.7
            })
        });

        const data = await response.json();
        
        if (data.error) {
            return res.status(500).json({ error: "Erro na chave da OpenAI" });
        }

        // Retorna apenas a string de texto gerada pela IA
        res.status(200).json(data.choices[0].message.content);

    } catch (e) {
        res.status(500).json({ error: "Erro interno no servidor" });
    }
}