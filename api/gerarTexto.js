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
                // Localize este bloco no seu gerarTexto.js e substitua:
messages: [
    {
        role: "system",
        content: "Você é um especialista em Shopee Brasil. Responda seguindo exatamente este formato: TITULO ### DESCRIÇÃO ### TAGS. Regras: 1. O TITULO não pode ter emojis. 2. A DESCRIÇÃO deve ter muitos emojis. 3. As TAGS devem começar com #. Use ### para separar as partes."
    },
    {
        role: "user",
        content: `Crie um anúncio para: ${nome}, preço R$ ${preco}.`
    }
],
                ],
                temperature: 0.8
            })
        });

        const data = await response.json();
        
        // Se a OpenAI der erro, precisamos avisar o frontend
        if (data.error) {
            return res.status(500).json("Erro na chave da OpenAI");
        }

        res.status(200).json(data.choices[0].message.content);

    } catch (error) {
        res.status(500).json("Erro de conexão");
    }
}