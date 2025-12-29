#!/usr/bin/env bash
# STRIPE MULTI-CONTA - REFERÊNCIA RÁPIDA
# Use este arquivo como cola quando precisar lembrar um conceito rápido

cat << 'EOF'

╔══════════════════════════════════════════════════════════════════════════════╗
║            STRIPE MULTI-CONTA - REFERÊNCIA RÁPIDA (COLA)                    ║
╚══════════════════════════════════════════════════════════════════════════════╝

═════════════════════════════════════════════════════════════════════════════════

📍 ESTOU FAZENDO ISTO:                    → USO ESTA FUNÇÃO:

  Criando novo checkout PF                  getStripeInstance('create')
  Renovando assinatura PF                   getStripeInstance('renew')
  Cancelando (não sei qual conta)           identifySubscriptionAccount(subId)
  Precisando de preço                       getPriceId(vipTier, planType)
  Processando webhook                       verifyWebhookSignature(body, sig)

═════════════════════════════════════════════════════════════════════════════════

🔐 VARIÁVEIS DE AMBIENTE:

  PJ (ANTIGA):
    STRIPE_SECRET_KEY_PJ=sk_test_...
    STRIPE_WEBHOOK_SECRET_PJ=whsec_...

  PF (NOVA):
    STRIPE_SECRET_KEY_PF=sk_test_...
    STRIPE_WEBHOOK_SECRET_PF=whsec_...
    STRIPE_PRICEID_PF_DIAMOND_MONTHLY=price_...
    STRIPE_PRICEID_PF_DIAMOND_ANNUAL=price_...
    STRIPE_PRICEID_PF_LIFETIME=price_...

═════════════════════════════════════════════════════════════════════════════════

💻 SINTAXE DAS FUNÇÕES:

  // Obter Stripe correto
  const { stripe, account } = stripeService.getStripeInstance('create');
  // Retorna: { stripe: stripePF, account: 'pf' }

  // Validar webhook
  const { event, stripe, account } = stripeService.verifyWebhookSignature(
    body,
    req.headers['stripe-signature']
  );
  // Retorna: { event: {...}, stripe: stripePF ou stripePJ, account: 'pf' ou 'pj' }

  // Encontrar conta de assinatura
  const account = await stripeService.identifySubscriptionAccount('sub_123');
  // Retorna: 'pj' ou 'pf'

  // Obter preço
  const priceId = stripeService.getPriceId('diamond', 'monthly');
  // Retorna: 'price_XXX'

═════════════════════════════════════════════════════════════════════════════════

🎯 MATRIZ RÁPIDA:

  OPERAÇÃO      | ACCOUNT | RETORNO                    | EXEMPLO
  ──────────────┼─────────┼────────────────────────────┼──────────────────────────
  CRIAR         | PF      | { stripe, account }        | getStripeInstance('create')
  RENOVAR       | PF      | { stripe, account }        | getStripeInstance('renew')
  CANCELAR      | AMBOS   | { stripe, account }        | identifySubscriptionAccount()
  WEBHOOK       | AMBOS   | { event, stripe, account } | verifyWebhookSignature()
  PREÇO         | PF      | string                     | getPriceId()

═════════════════════════════════════════════════════════════════════════════════

⚡ SNIPPETS PRONTOS:

  --- CRIAÇÃO ---
  const { stripe } = stripeService.getStripeInstance('create');
  const priceId = stripeService.getPriceId(vipTier, planType);
  const session = await stripe.checkout.sessions.create({ ... });

  --- RENOVAÇÃO ---
  const { stripe } = stripeService.getStripeInstance('renew');
  const updated = await stripe.subscriptions.update(subId, { ... });

  --- CANCELAMENTO ---
  const account = await stripeService.identifySubscriptionAccount(subId);
  const { stripe } = stripeService.getStripeInstance('cancel', { isLegacy: account === 'pj' });
  await stripe.subscriptions.del(subId);

  --- WEBHOOK ---
  const { event, stripe, account } = stripeService.verifyWebhookSignature(
    req.body,
    req.headers['stripe-signature']
  );
  switch (event.type) {
    case 'invoice.paid':
      const sub = await stripe.subscriptions.retrieve(event.data.object.subscription);
      break;
  }

═════════════════════════════════════════════════════════════════════════════════

🧪 TESTES RÁPIDOS:

  # Escutar webhooks PJ
  stripe listen --forward-to localhost:3000/webhook/stripe/pj

  # Escutar webhooks PF
  stripe listen --forward-to localhost:3000/webhook/stripe/pf

  # Simular evento
  stripe trigger checkout.session.completed

  # Verificar eventos recebidos
  stripe listen --list

═════════════════════════════════════════════════════════════════════════════════

❓ QUANDO NÃO SOUBER O QUÊ FAZER:

  P: Qual conta devo usar?
  R: SEMPRE PF para criação/renovação. Para cancelamento, detectar com identifySubscriptionAccount()

  P: Qual webhook devo processar?
  R: POST /webhook recebe ambas. verifyWebhookSignature() detecta automaticamente.

  P: Como saber se cliente é legado?
  R: Consulte user.stripeAccountOrigin ou chame identifySubscriptionAccount()

  P: Webhook não é validado?
  R: Verificar se signature foi criada com o secret correto (PJ vs PF)

  P: Subscription not found?
  R: Sub é de outra conta. Usar identifySubscriptionAccount() para localizar.

═════════════════════════════════════════════════════════════════════════════════

📋 CHECKLIST RÁPIDO ANTES DE COMMITAR:

  [ ] Importou stripeService?
  [ ] Removeu require('stripe')(process.env.STRIPE_SECRET_KEY)?
  [ ] Usou função correta de stripeService?
  [ ] Testou com Stripe CLI?
  [ ] Verificou logs para "Conta: PJ" ou "Conta: PF"?
  [ ] Rodou em staging?

═════════════════════════════════════════════════════════════════════════════════

🚨 ERROS COMUNS:

  ❌ const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  ✅ const { stripe } = stripeService.getStripeInstance('create');

  ❌ await stripe.subscriptions.retrieve(subId);
  ✅ const account = await stripeService.identifySubscriptionAccount(subId);
     const { stripe } = stripeService.getStripeInstance('retrieve', { account });

  ❌ const sig = process.env.STRIPE_WEBHOOK_SECRET;
  ✅ const { event, stripe } = stripeService.verifyWebhookSignature(body, sig);

  ❌ const priceId = process.env.STRIPE_PRICEID_MONTHLY;
  ✅ const priceId = stripeService.getPriceId('diamond', 'monthly');

═════════════════════════════════════════════════════════════════════════════════

📞 NEED HELP?

  Arquivo                          | Quando usar
  ─────────────────────────────────┼──────────────────────────────────────
  INDEX.md                          | Começar / Navegar documentação
  README_STRIPE_MULTI_CONTA.md      | Visão geral rápida
  STRIPE_SETUP_GUIDE.md             | Passo-a-passo inicial
  STRIPE_ARCHITECTURE.md            | Detalhes técnicos
  STRIPE_INTEGRATION_EXAMPLES.js    | Ver exemplo de código
  STRIPE_TEST_EXAMPLES.js           | Como testar
  STRIPE_CHECKLIST.sh               | Verificar progresso
  STRIPE_TECHNICAL_SUMMARY.md       | Resumo executivo
  STRIPE_DIAGRAMS.sh                | Ver diagramas visuais
  STRIPE_QUICK_REFERENCE.sh         | Este arquivo

═════════════════════════════════════════════════════════════════════════════════

⏱️ TEMPO DE CADA OPERAÇÃO:

  Criar checkout               | ~100ms
  Processar webhook            | ~500ms
  Cancelar assinatura          | ~200ms
  Identificar conta            | ~1000ms (procura em ambas)
  Renovar assinatura           | ~300ms

═════════════════════════════════════════════════════════════════════════════════

EOF

exit 0
