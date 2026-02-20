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
// No arquivo gerarTexto.js, substitua o content do system por este:
content: "Você é um especialista em SEO Shopee Brasil. Responda seguindo RIGOROSAMENTE este formato: TITULO [DIVIDIR] DESCRIÇÃO [DIVIDIR] TAGS. 
Regras:
1. O TITULO deve ser apenas texto, focado em SEO, SEM EMOJIS.
2. A DESCRIÇÃO deve ser completa e com MUITOS EMOJIS.
3. As TAGS devem começar com # e separadas por vírgula.
4. Use apenas [DIVIDIR] para separar as três partes."
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