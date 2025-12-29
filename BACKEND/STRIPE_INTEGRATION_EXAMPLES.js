/**
 * EXEMPLO: Como integrar o stripeService em diferentes routes
 * 
 * Este arquivo mostra os padrões de como usar a arquitetura multi-conta
 * em diferentes operações (criação, renovação, cancelamento)
 */

// ============================================================================
// 1. CRIAÇÃO DE ASSINATURA (routes/payment.js)
// ============================================================================

/*
const stripeService = require('../lib/stripeService');

router.post('/vip-payment', async (req, res) => {
  // Obter Stripe PF (SEMPRE para criação)
  const { stripe } = stripeService.getStripeInstance('create');
  const priceId = stripeService.getPriceId(vipTier, planType);

  const session = await stripe.checkout.sessions.create({
    // ... configuração ...
    metadata: {
      vipTier,
      subscriptionType: planType,
    },
  });
});
*/

// ============================================================================
// 2. RENOVAÇÃO DE ASSINATURA (routes/Renewvip.js)
// ============================================================================

/*
const stripeService = require('../lib/stripeService');

router.post('/renew-subscription', async (req, res) => {
  const { subscriptionId } = req.body;

  // Obter Stripe PF (SEMPRE para renovação)
  const { stripe } = stripeService.getStripeInstance('renew');

  const updatedSub = await stripe.subscriptions.update(subscriptionId, {
    // ... configuração de renovação ...
  });
});
*/

// ============================================================================
// 3. CANCELAMENTO DE ASSINATURA (routes/Cancelsubscription.js)
// ============================================================================

/*
const stripeService = require('../lib/stripeService');

router.post('/cancel-subscription', async (req, res) => {
  const { subscriptionId, userEmail } = req.body;

  try {
    // Encontrar qual conta tem essa assinatura
    const account = await stripeService.identifySubscriptionAccount(subscriptionId);
    
    // Obter Stripe correspondente
    const { stripe } = stripeService.getStripeInstance('cancel', {
      isLegacy: account === 'pj'
    });

    // Cancelar
    const deleted = await stripe.subscriptions.del(subscriptionId, {
      proration_behavior: 'create_prorations',
    });

    res.json({ success: true, message: 'Assinatura cancelada' });
  } catch (error) {
    console.error('Erro ao cancelar:', error.message);
    res.status(500).json({ error: error.message });
  }
});
*/

// ============================================================================
// 4. CUSTOMER PORTAL (routes/stripeCustomerPortal.js)
// ============================================================================

/*
const stripeService = require('../lib/stripeService');

router.post('/create-portal-session', async (req, res) => {
  const { customerId } = req.body;

  try {
    // Determinar qual conta tem este customer
    // Opção 1: Consultar no banco (campo stripeAccountOrigin)
    const user = await User.findOne({ where: { stripeCustomerId: customerId } });
    const account = user?.stripeAccountOrigin || 'pj';

    // Opção 2: Tentar PF primeiro, depois PJ
    // const account = await identifyCustomerAccount(customerId);

    const { stripe } = stripeService.getStripeInstance('portal', {
      isLegacy: account === 'pj'
    });

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.FRONTEND_URL}/account`,
    });

    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
*/

// ============================================================================
// 5. WEBHOOK PROCESSING
// ============================================================================

/*
const stripeService = require('../lib/stripeService');

router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  // Validar e obter conta
  const { event, stripe, account } = stripeService.verifyWebhookSignature(
    req.body,
    req.headers['stripe-signature']
  );

  console.log(`Webhook from account: ${account}`);

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      // ... processar checkout (sempre PF)
      break;
    }

    case 'invoice.paid': {
      const invoice = event.data.object;
      
      // Pode vir de PJ ou PF
      // A instância 'stripe' já é a correta (PJ ou PF)
      const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
      // ... processar pagamento ...
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object;
      // ... processar cancelamento ...
      break;
    }
  }

  res.json({ received: true });
});
*/

// ============================================================================
// PADRÕES E BOAS PRÁTICAS
// ============================================================================

/*
✅ SEMPRE USE:
  - stripe da instância retornada por getStripeInstance()
  - verifyWebhookSignature() para validar webhooks
  - identifySubscriptionAccount() quando não souber a conta

❌ NUNCA USE:
  - require('stripe')(process.env.STRIPE_SECRET_KEY) - está deprecado
  - process.env.STRIPE_WEBHOOK_SECRET - pode ser de conta errada
  - Assumir que customer/subscription está em PF

🎯 LEMBRE-SE:
  - CRIAÇÃO → SEMPRE PF
  - RENOVAÇÃO → SEMPRE PF
  - CANCELAMENTO → Verificar com identifySubscriptionAccount()
  - WEBHOOK → Detecta automaticamente
*/

module.exports = {
  // Este arquivo é apenas documentação/exemplo
};
