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
                        content: `Você é um Robô Especialista em SEO para Shopee. 
                        Sua tarefa única é transformar nomes curtos em títulos LONGOS e PODEROSOS.

                        REGRAS DO TÍTULO:
                        - Mínimo 70 caracteres, Máximo 80 caracteres.
                        - PROIBIDO EMOJIS.
                        - Se o nome for curto, você DEVE inventar palavras-chave relevantes para preencher o espaço.
                        - Use: [Nome do Produto] + [Especificações Técnicas] + [Palavras de Busca: Original, Pronta Entrega, Envio Imediato, Premium, Promoção].
                        
                        EXEMPLO DE EXPANSÃO:
                        Usuário: "Copo Stanley"
                        Seu Título: "Copo Térmico Com Tampa Inox 473ml Cerveja Gelada Original Pronta Entrega"

                        FORMATO DE RESPOSTA: TITULO | DESCRIÇÃO COM EMOJIS | TAGS`
                    },
                    {
                        role: "user",
                        content: `Expanda o produto "${nome}" para um título de 80 caracteres focado em SEO Shopee. Preço: R$ ${preco}.`
                    }
                ],
                temperature: 0.9 // Aumentado para ela ter "espaço" para inventar palavras de busca
            })
        });

        const data = await response.json();
        res.setHeader('Cache-Control', 'no-store');
        res.status(200).json(data.choices[0].message.content);
    } catch (error) {
        res.status(500).json("Erro na conexão");
    }
}