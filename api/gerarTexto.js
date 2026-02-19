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
                        content: `Você é um Especialista em SEO de Marketplace para Shopee Brasil.
                        SUA RESPOSTA DEVE SER NO FORMATO: TITULO | DESCRIÇÃO | TAGS

                        REGRAS RÍGIDAS DO TÍTULO (DIRETRIZES SHOPEE):
                        1. PROIBIDO: Não use emojis, símbolos ou caracteres especiais no título.
                        2. TAMANHO: Máximo 80 caracteres.
                        3. ESTRUTURA: [Palavra-Chave Principal] + [Marca/Modelo] + [Atributo] + [Diferencial].
                        4. CAPITALIZAÇÃO: Primeira Letra De Cada Palavra Em Maiúscula.
                        5. EXCELÊNCIA: O título deve ser focado em busca orgânica (Ex: "Fone De Ouvido Bluetooth Sem Fio Original Pronta Entrega").

                        REGRAS DA DESCRIÇÃO:
                        - Aqui você DEVE usar muitos emojis (✅, 🔥, 🚀) para converter a venda.
                        - Use listas e tópicos claros.

                        FORMATO DE RESPOSTA: Apenas as 3 partes separadas por "|".`
                    },
                    {
                        role: "user",
                        content: `Gere um anúncio profissional de elite para: ${nome}, preço R$ ${preco}.`
                    }
                ],
                temperature: 0.7
            })
        });

        const data = await response.json();
        res.status(200).json(data.choices[0].message.content);
    } catch (error) {
        res.status(500).json("Erro na conexão com a IA");
    }
}