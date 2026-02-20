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
                        // Usamos CRASE (`) aqui para envolver todo o texto e evitar erro com aspas
                        content: `Você é um especialista em SEO Shopee Brasil. 
                        Responda seguindo RIGOROSAMENTE este formato: TITULO ### DESCRIÇÃO ### TAGS. 
                        
                        REGRAS DO TÍTULO:
                        - Deve ter entre 70 e 90 caracteres (CONTE OS CARACTERES ANTES DE RESPONDER).
                        - SEM EMOJIS no título.
                        - NÃO REPITA DE JEITO NENHUM este título anterior: "${evitar}".
                        - Gere uma variação totalmente nova com diferentes gatilhos mentais.
                        
                        REGRAS DA DESCRIÇÃO:
                        - Use muitos emojis e organize em tópicos.
                        
                        REGRAS DAS TAGS:
                        - Use # e apenas o separador ###.`
                    },
                    { role: "user", content: `Produto: ${nome}, Preço: ${preco}` }
                ],
                temperature: 0.8 // Aumentei um pouco para garantir mais criatividade nas variações
            })
        });

        const data = await response.json();

        // Verificação de segurança caso a OpenAI retorne erro
        if (data.error) {
            return res.status(500).json({ error: data.error.message });
        }

        res.status(200).json(data.choices[0].message.content);
    } catch (e) {
        res.status(500).json({ error: "Erro interno: " + e.message });
    }
}