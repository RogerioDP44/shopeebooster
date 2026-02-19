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
                        content: `Você é o maior Especialista em SEO para Shopee Brasil. 
                        Sua missão é criar títulos que dominam a busca e geram cliques imediatos.

                        REGRAS PARA O TÍTULO (MÁXIMO 80 CARACTERES):
                        - Use a técnica: [Palavra-Chave Principal] + [Atributo/Modelo] + [Benefício/Diferencial].
                        - Use termos que brasileiros buscam: "Original", "Pronta Entrega", "Envio Imediato", "Promoção", "Oferta", "Premium".
                        - Primeira Letra De Cada Palavra Sempre Em Maiúscula.
                        - Exemplo ruim: "Guaraná Antártica 350ml". 
                        - Exemplo Elite: "Guaraná Antártica 350ml Refrigerante Lata Original Pronta Entrega".

                        FORMATO DE RESPOSTA:
                        TITULO OTIMIZADO | DESCRIÇÃO COM MUITOS EMOJIS | TAGS`
                    },
                    {
                        role: "user",
                        content: `Gere um anúncio de ELITE para: ${nome}, preço R$ ${preco}.`
                    }
                ],
                temperature: 0.8
            })
        });

        const data = await response.json();
        res.status(200).json(data.choices[0].message.content);
    } catch (error) {
        res.status(500).json("Erro na IA");
    }
}