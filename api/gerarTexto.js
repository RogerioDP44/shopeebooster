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
                        content: "Você é um especialista em SEO Shopee Brasil. Responda seguindo RIGOROSAMENTE este formato: TITULO ### DESCRIÇÃO ### TAGS. Regras: 1. O TITULO deve ser apenas texto entre 70 e 90 caracteres. Nem mais nem menos, SEM EMOJIS Foque em palavras-chaves de alta conversão, NÃO REPITA o seguinte título: "${evitar}". Gere uma variação totalmente nova, mudando os gatilhos mentais (ex: se usou 'Luxo', use 'Oferta Especial'). 2. A DESCRIÇÃO deve ter muitos emojis. 3. As TAGS devem ter #. Use apenas ### como separador."
                    },
                    { role: "user", content: `Produto: ${nome}, Preço: ${preco}` }
                ],
                temperature: 0.7
            })
        });

        const data = await response.json();
        res.status(200).json(data.choices[0].message.content);
    } catch (e) {
        res.status(500).json({ error: "Erro interno" });
    }
}