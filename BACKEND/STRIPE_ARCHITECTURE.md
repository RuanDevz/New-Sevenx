# ARQUITETURA STRIPE MULTI-CONTA

## 📋 Visão Geral

Sistema com **duas contas Stripe distintas**:
- **PJ (ANTIGA)**: Processamento de assinaturas legadas
- **PF (NOVA)**: Novas assinaturas e renovações

```
┌─────────────────────────────────────────────────────────────┐
│                     SEVENXLEAKS BACKEND                      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────┐      ┌──────────────────────┐    │
│  │   STRIPE PJ (OLD)    │      │   STRIPE PF (NEW)    │    │
│  │                      │      │                      │    │
│  │ • Webhooks legados   │      │ • Criar assinatura   │    │
│  │ • Cancelamento old   │      │ • Renovar (updates)  │    │
│  │ • Consulta legacy    │      │ • Webhooks novo      │    │
│  │                      │      │                      │    │
│  │ sk_test_PJ_XXX       │      │ sk_test_PF_XXX       │    │
│  └──────────────────────┘      └──────────────────────┘    │
│           ▲                              ▲                   │
│           │                              │                   │
└───────────┼──────────────────────────────┼───────────────────┘
            │                              │
            │ webhook/stripe/pj            │ webhook/stripe/pf
            │ (legacy events)              │ (new events)
            │                              │
```

---

## 🔑 Variáveis de Ambiente

### Conta PJ (Antiga)
```env
# Chave da API PJ
STRIPE_SECRET_KEY_PJ=sk_test_PJ_SECRET_HERE

# Webhook signature da PJ
STRIPE_WEBHOOK_SECRET_PJ=whsec_PJ_SECRET_HERE
```

### Conta PF (Nova)
```env
# Chave da API PF
STRIPE_SECRET_KEY_PF=sk_test_PF_SECRET_HERE

# Webhook signature da PF
STRIPE_WEBHOOK_SECRET_PF=whsec_PF_SECRET_HERE

# Preços em PF (criar os preços no dashboard PF)
STRIPE_PRICEID_PF_DIAMOND_MONTHLY=price_XXX
STRIPE_PRICEID_PF_DIAMOND_ANNUAL=price_XXX
STRIPE_PRICEID_PF_LIFETIME=price_XXX
```

---

## 🔄 Fluxo de Operações

### 1️⃣ CRIAÇÃO DE ASSINATURA (Nova)
```
POST /vip-payment
  └─> stripeService.getStripeInstance('create')
      └─> stripePF (SEMPRE)
          └─> stripePF.checkout.sessions.create()
              └─> Redirect para PF checkout
```
- **Conta**: PF
- **Função**: `routes/payment.js`
- **Código**: Usar `stripePF` sempre

### 2️⃣ RENOVAÇÃO (Update)
```
PUT /renew-subscription
  └─> stripeService.getStripeInstance('renew')
      └─> stripePF (SEMPRE)
          └─> stripePF.subscriptions.update()
```
- **Conta**: PF
- **Função**: `routes/Renewvip.js`
- **Código**: Usar `stripePF` sempre

### 3️⃣ CANCELAMENTO
```
DELETE /cancel-subscription
  └─> Check: É legado?
      ├─> SIM: stripeService.identifySubscriptionAccount()
      │   └─> stripePJ.subscriptions.del()
      └─> NÃO: stripePF.subscriptions.del()
```
- **Conta**: Depende se é legado (PJ) ou novo (PF)
- **Função**: `routes/Cancelsubscription.js`
- **Lógica**:
```javascript
const account = await stripeService.identifySubscriptionAccount(subId);
const stripe = account === 'pj' ? stripePJ : stripePF;
await stripe.subscriptions.del(subId);
```

### 4️⃣ WEBHOOKS
```
POST /webhook/stripe/pj  (eventos legacy)
  └─> stripeService.verifyWebhookSignature() → PJ
      └─> Processar invoice.paid (legacy)
      └─> Processar customer.subscription.deleted
      
POST /webhook/stripe/pf  (eventos novos)
  └─> stripeService.verifyWebhookSignature() → PF
      └─> Processar checkout.session.completed
      └─> Processar invoice.paid (novo)
      └─> Processar customer.subscription.deleted
```

---

## 📊 Mapeamento de Eventos de Webhook

### PJ (Conta Antiga) - `webhook/stripe/pj`
Eventos a configurar no dashboard PJ:
```
✓ invoice.paid              (fatura paga - legacy)
✓ invoice.payment_failed    (pagamento falhou - legacy)
✓ customer.subscription.deleted (cancelamento - legacy)
✓ customer.subscription.updated (atualização - legacy)
```

### PF (Conta Nova) - `webhook/stripe/pf`
Eventos a configurar no dashboard PF:
```
✓ checkout.session.completed (novo checkout)
✓ invoice.paid              (fatura paga - novo)
✓ invoice.payment_failed    (pagamento falhou - novo)
✓ customer.subscription.deleted (cancelamento - novo)
✓ customer.subscription.updated (atualização - novo)
```

---

## 🛠️ Serviço Stripe (`lib/stripeService.js`)

### Funções Principais

#### `getStripeInstance(operation, context)`
Retorna qual Stripe usar
```javascript
// Criação sempre PF
const { stripe, account } = getStripeInstance('create');
// stripePF, 'pf'

// Renovação sempre PF
const { stripe, account } = getStripeInstance('renew');
// stripePF, 'pf'

// Cancelamento depende do contexto
const { stripe, account } = getStripeInstance('cancel', { isLegacy: true });
// stripePJ, 'pj'
```

#### `verifyWebhookSignature(body, sig)`
Valida webhook com ambas as contas
```javascript
const { event, account, stripe } = verifyWebhookSignature(body, sig);
// Tenta PF, depois PJ, retorna qual validou
```

#### `identifySubscriptionAccount(subscriptionId)`
Encontra qual conta tem uma assinatura
```javascript
const account = await identifySubscriptionAccount('sub_123');
// Retorna 'pf' ou 'pj'
```

#### `getPriceId(vipTier, planType)`
Recupera preço (sempre de PF)
```javascript
const priceId = getPriceId('diamond', 'monthly');
// process.env.STRIPE_PRICEID_PF_DIAMOND_MONTHLY
```

---

## 📝 Atualizações Necessárias nos Routes

### `routes/payment.js` (Criação)
```javascript
const stripeService = require('../lib/stripeService');

router.post('/vip-payment', async (req, res) => {
  // ...validações...
  
  const { stripe } = stripeService.getStripeInstance('create');
  const priceId = stripeService.getPriceId(vipTier, planType);
  
  const session = await stripe.checkout.sessions.create({
    // ... usar stripe (PF) ...
  });
});
```

### `routes/Cancelsubscription.js` (Cancelamento)
```javascript
const stripeService = require('../lib/stripeService');

router.post('/cancel-subscription', async (req, res) => {
  const { subscriptionId } = req.body;
  const account = await stripeService.identifySubscriptionAccount(subscriptionId);
  
  const { stripe } = stripeService.getStripeInstance('cancel', { 
    isLegacy: account === 'pj' 
  });
  
  await stripe.subscriptions.del(subscriptionId);
});
```

### `routes/stripewebhook.js` (Webhooks)
```javascript
const stripeService = require('../lib/stripeService');

router.post('/', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const { event, account, stripe } = stripeService.verifyWebhookSignature(
      req.body, 
      req.headers['stripe-signature']
    );
    
    // event, stripe já identificado corretamente
    // Processar normalmente usando stripe (PJ ou PF)
    
    switch (event.type) {
      case 'checkout.session.completed':
        // Lógica existente... usar stripe (será PF)
        break;
      case 'invoice.paid':
        // Lógica existente... usar stripe (pode ser PJ ou PF)
        break;
      // ...
    }
  } catch (err) {
    console.error('Webhook error:', err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
});
```

---

## 🎯 Fluxo de Transição

### Fase 1: Assinaturas Legadas (PJ)
- Clientes com assinaturas em PJ continuam em PJ
- Webhooks de PJ processam `invoice.paid` para renovação
- Cancelamentos via PJ

### Fase 2: Novas Assinaturas (PF)
- Novos clientes criam assinatura em PF
- Webhooks de PF processam novos eventos
- Renovações via PF

### Fase 3: Migração (Opcional)
Quando quiser migrar clientes de PJ → PF:
1. Cancelar em PJ
2. Criar nova em PF
3. Manter histórico em field `stripeAccountOrigin`

---

## 🔍 Campos do Banco de Dados

Adicionar ao modelo `User`:
```javascript
// Suportar ambas as contas
stripeCustomerId: 'STRING',        // Customer ID em PJ
stripeCustomerIdNew: 'STRING',     // Customer ID em PF (opcional)
stripeSubscriptionId: 'STRING',    // Subscription em PJ
stripeSubscriptionIdNew: 'STRING', // Subscription em PF (opcional)

// Rastreamento
stripeAccountOrigin: 'STRING',     // 'pj' ou 'pf' (identifica origem)
```

---

## ✅ Checklist de Configuração

### No Stripe Dashboard PJ
- [ ] Copiar Secret Key → `STRIPE_SECRET_KEY_PJ`
- [ ] Criar Webhook para `https://seu-dominio.com/webhook/stripe/pj`
- [ ] Copiar Webhook Secret → `STRIPE_WEBHOOK_SECRET_PJ`
- [ ] Configurar eventos: `invoice.paid`, `customer.subscription.deleted`, etc

### No Stripe Dashboard PF
- [ ] Copiar Secret Key → `STRIPE_SECRET_KEY_PF`
- [ ] Criar Webhook para `https://seu-dominio.com/webhook/stripe/pf`
- [ ] Copiar Webhook Secret → `STRIPE_WEBHOOK_SECRET_PF`
- [ ] Criar Preços: Diamond Monthly, Diamond Annual, Lifetime
- [ ] Copiar Price IDs → `STRIPE_PRICEID_PF_*`
- [ ] Configurar eventos: `checkout.session.completed`, `invoice.paid`, etc

---

## 🧪 Testando Webhooks Localmente

### PJ (Legacy)
```bash
stripe listen --forward-to localhost:3000/webhook/stripe/pj
# Copiar webhook secret em STRIPE_WEBHOOK_SECRET_PJ
```

### PF (Nova)
```bash
stripe listen --forward-to localhost:3000/webhook/stripe/pf
# Copiar webhook secret em STRIPE_WEBHOOK_SECRET_PF
```

---

## 🚨 Erros Comuns

| Erro | Causa | Solução |
|------|-------|--------|
| "Webhook signature inválida" | Signature de uma conta usada em outra | Verificar qual conta enviou (PJ ou PF) |
| "Subscription not found" | Sub em PJ, tentando recuperar em PF | Usar `identifySubscriptionAccount()` |
| "Price not configured" | Preço não existe na conta PF | Criar preço em PF e preencher .env |
| "Customer not found" | Customer em PJ, usando stripe PF | Verificar qual conta tem o cliente |

---

## 📞 Suporte

Para dúvidas sobre qual conta usar:
- **CRIAÇÃO**: Sempre PF
- **RENOVAÇÃO**: Sempre PF
- **CANCELAMENTO**: Depende (use `identifySubscriptionAccount()`)
- **WEBHOOK**: Detectado automaticamente pelo signature
