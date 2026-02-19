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
                        content: `Você é um Especialista em SEO e Copywriting para Shopee. 
                        
                        REGRAS DO TÍTULO: 
                        - Máximo 80 caracteres, SEM EMOJIS, foco total em busca orgânica.

                        REGRAS DA DESCRIÇÃO (ORGANIZAÇÃO TOTAL):
                        - Use parágrafos curtos e pule linhas entre eles.
                        - Use tópicos com emojis para facilitar a leitura.
                        - Estrutura obrigatória:
                          1. Frase de impacto com emoji.
                          2. Seção "✅ BENEFÍCIOS".
                          3. Seção "📦 ESPECIFICAÇÕES".
                          4. Seção "🚀 POR QUE COMPRAR CONOSCO?".
                        
                        FORMATO: TITULO | DESCRIÇÃO | TAGS`
                    },
                    {
                        role: "user",
                        content: `Gere um anúncio profissional para: ${nome}, preço R$ ${preco}.`
                    }
                ],
                temperature: 0.7
            })
        });

        const data = await response.json();
        res.setHeader('Cache-Control', 'no-store');
        res.status(200).json(data.choices[0].message.content);
    } catch (error) {
        res.status(500).json("Erro na conexão");
    }
}