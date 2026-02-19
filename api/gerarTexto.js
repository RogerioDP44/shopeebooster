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
                        content: `Você é um robô especialista em vendas e SEO para Shopee Brasil.
                        SUA RESPOSTA DEVE SEGUIR ESTE FORMATO EXATO:
                        TITULO EM MAIÚSCULAS | DESCRIÇÃO COM MUITOS EMOJIS | TAGS
                        
                        REGRAS:
                        - Título: FOCO total em SEO, letras maiúsculas, máximo 120 caracteres.
                        - Descrição: Use MUITOS emojis relevantes (mínimo 15). Organize em tópicos (✅ Benefícios, 📦 Envio, 🔥 Oferta).
                        - Tags: Gere 10 hashtags estratégicas.`
                    },
                    {
                        role: "user",
                        content: `Gere um anúncio irresistível com muitos emojis para: ${nome}, preço sugerido R$ ${preco}.`
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