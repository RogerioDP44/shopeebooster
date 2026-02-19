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
                        content: `Você é um copywriter especialista em Shopee Brasil. 
                        Sua missão é criar anúncios que vendem muito.
                        
                        REGRAS:
                        1. TÍTULO: Use a palavra-chave no início. Ex: "Fone Bluetooth..."
                        2. DESCRIÇÃO: Use MUITOS emojis relevantes (✅, 🔥, 🚀, 📦, 💎). 
                        3. ESTRUTURA: Comece com uma frase de impacto, liste 5 benefícios com emojis e termine com um CTA.
                        4. FORMATO: Responda APENAS assim: TITULO | DESCRIÇÃO COM EMOJIS | TAGS`
                    },
                    {
                        role: "user",
                        content: `Crie um anúncio magnético para: ${nome} por R$ ${preco}.`
                    }
                ]
            })
        });

        const data = await response.json();
        res.status(200).json(data.choices[0].message.content);
    } catch (error) {
        res.status(500).json("Erro na IA");
    }
}