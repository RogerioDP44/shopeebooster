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
                        content: `Você é um Especialista Sênior em SEO para Shopee Brasil. Sua função é transformar nomes simples em títulos de elite que dominam as buscas.

                        REGRAS RÍGIDAS PARA O TÍTULO:
                        - PROIBIDO usar emojis ou símbolos no título.
                        - MÁXIMO 80 caracteres.
                        - ESTRUTURA: [Palavra-Chave Principal] + [Especificações] + [Diferenciais].
                        - EXEMPLO DE TRANSFORMAÇÃO:
                          Entrada: "Garrafa"
                          Saída: "Garrafa De Água Squeeze 2 Litros Motivacional Academia Pronta Entrega"

                        REGRAS PARA A DESCRIÇÃO:
                        - Use MUITOS emojis (✅, 🔥, 🚀, 📦).
                        - Liste 5 benefícios e especificações técnicas.

                        REGRAS PARA AS TAGS:
                        - 10 hashtags separadas por espaço.

                        RESPONDA APENAS NESTE FORMATO:
                        TITULO | DESCRIÇÃO | TAGS`
                    },
                    {
                        role: "user",
                        content: `Produto: ${nome}. Preço: R$ ${preco}. Crie um anúncio profissional expandindo o título para SEO.`
                    }
                ],
                temperature: 0.8
            })
        });

        const data = await response.json();
        const textoGerado = data.choices[0].message.content;
        
        // Garante que o cache da Vercel não entregue resultado velho
        res.setHeader('Cache-Control', 'no-store, max-age=0');
        res.status(200).json(textoGerado);

    } catch (error) {
        res.status(500).json("Erro na conexão com a IA");
    }
}