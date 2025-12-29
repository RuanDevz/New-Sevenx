/**
 * SERVIÇO STRIPE MULTI-CONTA
 * 
 * Gerencia duas contas Stripe:
 * - PJ (ANTIGA): Apenas webhooks e cancelamento de assinaturas legadas
 * - PF (NOVA): Criação, renovação e webhooks de novas assinaturas
 */

const Stripe = require('stripe');

// Instâncias Stripe - uma para cada conta
const stripePJ = new Stripe(process.env.STRIPE_SECRET_KEY_PJ);
const stripePF = new Stripe(process.env.STRIPE_SECRET_KEY_PF);

/**
 * SELEÇÃO DE CONTA
 * Define qual Stripe usar baseado na operação
 */
function getStripeInstance(operation, context = {}) {
  const { isLegacy = false } = context;

  // Operações em novas assinaturas sempre usam PF
  if (operation === 'create' || operation === 'renew') {
    return { stripe: stripePF, account: 'pf' };
  }

  // Cancelamento: depende se é legado ou novo
  if (operation === 'cancel') {
    if (isLegacy) {
      return { stripe: stripePJ, account: 'pj' };
    }
    return { stripe: stripePF, account: 'pf' };
  }

  // Default: retorna ambas para webhook processing
  return { stripePJ, stripePF, accounts: ['pj', 'pf'] };
}

/**
 * VERIFICAÇÃO DE WEBHOOK
 * Identifica qual conta enviou o webhook pela assinatura
 */
function verifyWebhookSignature(body, sig) {
  // Tentar verificar com PF primeiro (novas assinaturas)
  try {
    const event = stripePF.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET_PF
    );
    return { event, account: 'pf', stripe: stripePF };
  } catch (err) {
    // Continuar para PJ
  }

  // Tentar verificar com PJ (assinaturas legadas)
  try {
    const event = stripePJ.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET_PJ
    );
    return { event, account: 'pj', stripe: stripePJ };
  } catch (err) {
    throw new Error(`Webhook signature inválida: ${err.message}`);
  }
}

/**
 * IDENTIFICAÇÃO DE CONTA
 * Quando não sabemos qual conta tem uma assinatura, procura em ambas
 */
async function identifySubscriptionAccount(subscriptionId) {
  try {
    // Tentar PF primeiro
    await stripePF.subscriptions.retrieve(subscriptionId);
    return 'pf';
  } catch (err) {
    // Se não encontrou em PF, deve ser PJ
    try {
      await stripePJ.subscriptions.retrieve(subscriptionId);
      return 'pj';
    } catch (err) {
      throw new Error(`Assinatura ${subscriptionId} não encontrada em nenhuma conta`);
    }
  }
}

/**
 * RECUPERAR PREÇO
 * Todos os preços estão em PF (nova conta)
 */
function getPriceId(vipTier, planType) {
  const prices = {
    diamond_monthly: process.env.STRIPE_PRICEID_PF_DIAMOND_MONTHLY,
    diamond_annual: process.env.STRIPE_PRICEID_PF_DIAMOND_ANNUAL,
    lifetime: process.env.STRIPE_PRICEID_PF_LIFETIME,
  };

  const key = planType ? `${vipTier}_${planType}` : vipTier;
  const priceId = prices[key];

  if (!priceId) {
    throw new Error(
      `Preço não configurado para: ${vipTier} - ${planType || 'lifetime'}`
    );
  }

  return priceId;
}

module.exports = {
  stripePJ,
  stripePF,
  getStripeInstance,
  verifyWebhookSignature,
  identifySubscriptionAccount,
  getPriceId,
};
