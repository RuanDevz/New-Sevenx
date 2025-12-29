const express = require('express');
const stripeService = require('../lib/stripeService');
const { User } = require('../models');

const router = express.Router();

router.post('/vip-payment', async (req, res) => {
    const { email, planType, vipTier } = req.body;

    if (!email || !vipTier) {
        return res.status(400).json({ error: 'Dados inválidos. Verifique o email e tier VIP.' });
    }

    // TITANIUM comentado - não está em uso
    // if (!['diamond', 'titanium', 'lifetime'].includes(vipTier)) {
    if (!['diamond', 'lifetime'].includes(vipTier)) {
        return res.status(400).json({ error: 'Tier VIP inválido. Use "diamond" ou "lifetime".' });
    }

    if (vipTier !== 'lifetime' && !planType) {
        return res.status(400).json({ error: 'Tipo de plano é obrigatório para Diamond.' });
    }

    if (vipTier !== 'lifetime' && !['monthly', 'annual'].includes(planType)) {
        return res.status(400).json({ error: 'Tipo de plano inválido. Use "monthly" ou "annual".' });
    }

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(403).json({ error: 'Este e-mail não está autorizado para pagamento.' });
        }

        // Usar stripePF para criar NOVA assinatura
        const { stripe } = stripeService.getStripeInstance('create');
        const priceId = stripeService.getPriceId(vipTier, planType === 'lifetime' ? null : planType);

        let session;

        if (vipTier === 'lifetime') {
            // lifetime: Pagamento único (não é subscription)
            session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                customer_email: email,
                line_items: [
                    {
                        price: priceId,
                        quantity: 1,
                    },
                ],
                mode: 'payment', 
                success_url: `${process.env.FRONTEND_URL}/success`,
                cancel_url: `${process.env.FRONTEND_URL}/cancel`,
                metadata: {
                    priceId: priceId,
                    vipTier: 'lifetime',
                    subscriptionType: 'lifetime',
                },
            });
        } else {
            // Diamond: Subscription (monthly ou annual)
            session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                customer_email: email,
                line_items: [
                    {
                        price: priceId,
                        quantity: 1,
                    },
                ],
                mode: 'subscription',
                success_url: `${process.env.FRONTEND_URL}/success`,
                cancel_url: `${process.env.FRONTEND_URL}/cancel`,
                metadata: {
                    priceId: priceId,
                    vipTier: vipTier,
                    subscriptionType: planType,
                },
            });
        }

        res.json({ url: session.url });
    } catch (error) {
        console.error('Erro ao criar sessão de checkout:', error.message, error.stack);
        res.status(500).json({ error: 'Erro ao criar sessão de checkout' });
    }
});

module.exports = router;
