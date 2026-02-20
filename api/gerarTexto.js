export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });
    const { nome, preco, evitar } = req.body;

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
                        content: `Você é um especialista em SEO Shopee Brasil. 
                        Responda seguindo RIGOROSAMENTE este formato: TITULO ### DESCRIÇÃO ### TAGS. 
                        
                        REGRAS DO TÍTULO:
                        - Deve ter entre 70 e 90 caracteres.
                        - PROIBIDO: Não escreva a contagem de caracteres (ex: "80 caracteres") no texto final.
                        - SEM EMOJIS no título.
                        - NÃO REPITA o título anterior: "${evitar}". Gere uma variação totalmente nova.
                        
                        REGRAS DA DESCRIÇÃO:
                        - Use muitos emojis e organize em tópicos.
                        - Não repita os mesmos argumentos da versão anterior: "${evitar}".

                        REGRAS DAS TAGS:
                        - Gere entre 6 e 10 tags relevantes.
                        - Use # e separe por espaços.

                        Use APENAS ### como separador entre as três partes.`
                    },
                    { role: "user", content: `Produto: ${nome}, Preço: ${preco}` }
                ],
                temperature: 0.8
            })
        });

        const data = await response.json();
        if (data.error) return res.status(500).json({ error: data.error.message });

        res.status(200).json(data.choices[0].message.content);
    } catch (e) {
        res.status(500).json({ error: "Erro interno: " + e.message });
    }
}