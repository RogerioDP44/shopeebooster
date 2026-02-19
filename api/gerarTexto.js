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
                model: "gpt-3.5-turbo",
                messages: [{
                    role: "system",
                    content: "Você é um especialista em SEO para Shopee. Responda APENAS no formato: TITULO | DESCRIÇÃO | TAGS"
                }, {
                    role: "user",
                    content: `Crie um anúncio vencedor para o produto: ${nome} que custa R$ ${preco}.`
                }]
            })
        });

        const data = await response.json();
        res.status(200).json(data.choices[0].message.content);
    } catch (error) {
        res.status(500).json("Erro ao conectar com a IA");
    }
}