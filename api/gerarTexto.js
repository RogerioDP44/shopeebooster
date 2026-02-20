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
content: "Você é um especialista em SEO para Shopee Brasil. Responda APENAS no formato: TITULO | DESCRIÇÃO | TAGS. Regras: 1. O TITULO deve ser focado em palavras-chave de busca, com no máximo 120 caracteres e SEM EMOJIS. 2. A DESCRIÇÃO deve usar o método AIDA e conter MUITOS EMOJIS. 3. As TAGS devem ser separadas por vírgula."
                    },
                    {
                        role: "user",
                        content: `Crie um anúncio para: ${nome}, preço R$ ${preco}.`
                    }
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