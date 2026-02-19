export default async function handler(req, res) {
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
                        content: `Você é um Especialista em SEO da Shopee. 
                        REGRAS RÍGIDAS:
                        1. TÍTULO: PROIBIDO usar emojis. Deve ter entre 60 e 90 caracteres. Comece com a palavra-chave e expanda com termos como 'Original', 'Pronta Entrega', 'Envio Imediato'.
                        2. DESCRIÇÃO: Use muitos emojis (✅, 🔥, 🚀).
                        3. FORMATO: TITULO | DESCRIÇÃO | TAGS`
                    },
                    {
                        role: "user",
                        content: `Crie um anúncio de ELITE para: ${nome}. Preço: R$ ${preco}`
                    }
                ],
                temperature: 0.3 // Menos criatividade = Mais obediência
            })
        });
        const data = await response.json();
        res.setHeader('Cache-Control', 'no-store');
        res.status(200).json(data.choices[0].message.content);
    } catch (e) {
        res.status(500).json("Erro na IA");
    }
}