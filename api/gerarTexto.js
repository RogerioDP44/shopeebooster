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
                        content: `Você é um Especialista em SEO e Copywriting para Shopee Brasil.
                        Sua missão é criar anúncios que dominam a primeira página.

                        REGRAS DE SEO PARA O TÍTULO:
                        - Coloque a Palavra-Chave Principal nas primeiras 3 palavras.
                        - Use o formato: [Produto] + [Especificação] + [Benefício/Diferencial].
                        - Primeira Letra De Cada Palavra Sempre Em Maiúscula.

                        REGRAS PARA A DESCRIÇÃO:
                        - Use MUITOS emojis (mínimo 10) como: ✅, 🔥, 🚀, 📦, 💰, 💎.
                        - Estrutura: Gancho de atenção, Lista de benefícios com checks, Especificações e CTA.
                        - Linguagem persuasiva e amigável.

                        RESPONDA APENAS NESTE FORMATO: 
                        TITULO OTIMIZADO | DESCRIÇÃO COM MUITOS EMOJIS | #TAGS #SEO #MARKETPLACE`
                    },
                    {
                        role: "user",
                        content: `Crie o anúncio perfeito para: ${nome}. Preço: R$ ${preco}.`
                    }
                ],
                temperature: 0.8 // Aumenta a criatividade para usar mais emojis
            })
        });

        const data = await response.json();
        res.status(200).json(data.choices[0].message.content);
    } catch (error) {
        res.status(500).json("Erro ao conectar com a IA");
    }
}