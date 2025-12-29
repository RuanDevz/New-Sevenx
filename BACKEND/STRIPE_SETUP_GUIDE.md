# GUIA DE CONFIGURAÇÃO - STRIPE MULTI-CONTA

## 🚀 Passo a Passo para Configurar Duas Contas Stripe

### FASE 1: PREPARAÇÃO NO STRIPE DASHBOARD

#### 1.1 Conta PJ (Antiga)

1. Acesse seu [Stripe Dashboard PJ](https://dashboard.stripe.com)
2. Vá para **Developers** → **API Keys**
3. Copie a chave secreta (começa com `sk_test_` ou `sk_live_`)
4. Salve em `.env`:
   ```env
   STRIPE_SECRET_KEY_PJ=sk_test_YOUR_PJ_KEY_HERE
   ```

5. Crie/atualize o Webhook:
   - Vá para **Developers** → **Webhooks**
   - Clique em "Add endpoint"
   - URL: `https://seu-dominio.com/webhook/stripe/pj`
   - Selecione eventos:
     ```
     ✓ invoice.paid
     ✓ invoice.payment_failed
     ✓ customer.subscription.deleted
     ✓ customer.subscription.updated
     ✓ invoice.created
     ```
   - Copie o "Signing secret" gerado
   - Salve em `.env`:
     ```env
     STRIPE_WEBHOOK_SECRET_PJ=whsec_YOUR_PJ_WEBHOOK_HERE
     ```

#### 1.2 Conta PF (Nova)

1. Acesse seu [Stripe Dashboard PF](https://dashboard.stripe.com)
2. Vá para **Developers** → **API Keys**
3. Copie a chave secreta
4. Salve em `.env`:
   ```env
   STRIPE_SECRET_KEY_PF=sk_test_YOUR_PF_KEY_HERE
   ```

5. **CRIE NOVOS PREÇOS** (muito importante!):
   - Vá para **Products**
   - Crie um produto "VIP Diamond" com:
     ```
     Diamond Monthly
       - Price ID salvar em: STRIPE_PRICEID_PF_DIAMOND_MONTHLY
     
     Diamond Annual
       - Price ID salvar em: STRIPE_PRICEID_PF_DIAMOND_ANNUAL
     
     VIP Lifetime (pagamento único)
       - Price ID salvar em: STRIPE_PRICEID_PF_LIFETIME
     ```

6. Crie o Webhook:
   - Vá para **Developers** → **Webhooks**
   - Clique em "Add endpoint"
   - URL: `https://seu-dominio.com/webhook/stripe/pf`
   - Selecione eventos:
     ```
     ✓ checkout.session.completed
     ✓ invoice.paid
     ✓ invoice.payment_failed
     ✓ customer.subscription.deleted
     ✓ customer.subscription.updated
     ✓ invoice.created
     ```
   - Copie o "Signing secret"
   - Salve em `.env`:
     ```env
     STRIPE_WEBHOOK_SECRET_PF=whsec_YOUR_PF_WEBHOOK_HERE
     ```

---

### FASE 2: CONFIGURAR .ENV

Seu arquivo `.env` deve ter:

```env
# ============================================================================
# STRIPE - CONTA PJ (ANTIGA)
# ============================================================================
STRIPE_SECRET_KEY_PJ=sk_test_YOUR_PJ_SECRET_HERE
STRIPE_WEBHOOK_SECRET_PJ=whsec_YOUR_PJ_WEBHOOK_HERE

# ============================================================================
# STRIPE - CONTA PF (NOVA)
# ============================================================================
STRIPE_SECRET_KEY_PF=sk_test_YOUR_PF_SECRET_HERE
STRIPE_WEBHOOK_SECRET_PF=whsec_YOUR_PF_WEBHOOK_HERE

# Preços em PF (obtidos do dashboard PF)
STRIPE_PRICEID_PF_DIAMOND_MONTHLY=price_1XXX...
STRIPE_PRICEID_PF_DIAMOND_ANNUAL=price_1XXX...
STRIPE_PRICEID_PF_LIFETIME=price_1XXX...

# URL pública (para testes com ngrok, stripe-cli, etc)
WEBHOOK_DOMAIN=https://seu-dominio-publico.com

# Resto da config
FRONTEND_URL=http://localhost:5173
# ... outras variáveis ...
```

---

### FASE 3: VERIFICAR CÓDIGO

#### 3.1 stripeService.js
- ✅ Arquivo criado em `lib/stripeService.js`
- Fornece funções para:
  - `getStripeInstance(operation)` - Saber qual Stripe usar
  - `verifyWebhookSignature()` - Validar webhooks de ambas contas
  - `identifySubscriptionAccount()` - Encontrar qual conta tem sub
  - `getPriceId()` - Recuperar preço correto

#### 3.2 Atualizações nos Routes

**routes/payment.js** - ✅ Já atualizado
```javascript
const stripeService = require('../lib/stripeService');
const { stripe } = stripeService.getStripeInstance('create');
```

**routes/stripewebhook.js** - ✅ Já atualizado
```javascript
const { event, stripe, account } = stripeService.verifyWebhookSignature(
  req.body,
  req.headers['stripe-signature']
);
```

**routes/Cancelsubscription.js** - ❌ PRECISA ATUALIZAR
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

**routes/Renewvip.js** - ❌ PRECISA ATUALIZAR (se existir)
```javascript
const stripeService = require('../lib/stripeService');

router.post('/renew-subscription', async (req, res) => {
  const { stripe } = stripeService.getStripeInstance('renew');
  // ... continuar com stripePF ...
});
```

**routes/stripeCustomerPortal.js** - ❌ PRECISA ATUALIZAR (se existir)
```javascript
const stripeService = require('../lib/stripeService');

router.post('/create-portal-session', async (req, res) => {
  const account = user.stripeAccountOrigin || 'pj'; // determinar conta
  const { stripe } = stripeService.getStripeInstance('portal', {
    isLegacy: account === 'pj'
  });
  // ... continuar ...
});
```

---

### FASE 4: TESTAR LOCALMENTE

#### 4.1 Com Stripe CLI (Recomendado)

```bash
# Terminal 1: Escutar webhooks PJ
stripe listen --forward-to localhost:3000/webhook/stripe/pj

# Copiar signing secret e salvar em .env
# STRIPE_WEBHOOK_SECRET_PJ=whsec_...

# Terminal 2: Escutar webhooks PF
stripe listen --forward-to localhost:3000/webhook/stripe/pf

# Copiar signing secret e salvar em .env
# STRIPE_WEBHOOK_SECRET_PF=whsec_...

# Terminal 3: Iniciar o servidor
npm start
```

#### 4.2 Testar Checkout (PF)

```bash
# Terminal com stripe listening
stripe trigger checkout.session.completed

# ou simular manualmente com:
curl -X POST http://localhost:3000/vip-payment \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","vipTier":"diamond","planType":"monthly"}'
```

#### 4.3 Testar Cancelamento

```bash
# Se é assinatura em PF (nova)
curl -X POST http://localhost:3000/cancel-subscription \
  -H "Content-Type: application/json" \
  -d '{"subscriptionId":"sub_1PF..."}'

# Se é assinatura em PJ (legado)
curl -X POST http://localhost:3000/cancel-subscription \
  -H "Content-Type: application/json" \
  -d '{"subscriptionId":"sub_1PJ..."}'
```

---

### FASE 5: MIGRAÇÃO DE DADOS (Opcional)

Se quiser migrar clientes de PJ → PF:

1. Marcar cliente como migrado:
   ```javascript
   user.stripeAccountOrigin = 'pf';
   user.stripeCustomerIdNew = newCustomerId;
   user.stripeSubscriptionIdNew = newSubscriptionId;
   await user.save();
   ```

2. Sistema detectará automaticamente qual conta usar

---

### 🧪 CHECKLIST DE TESTES

- [ ] Criar nova assinatura (PF) - ir para checkout
- [ ] Receber webhook `checkout.session.completed` (PF)
- [ ] Renovar assinatura existente (PF)
- [ ] Receber webhook `invoice.paid` (PF ou PJ)
- [ ] Cancelar assinatura nova (PF)
- [ ] Cancelar assinatura legado (PJ)
- [ ] Portal de clientes funciona para ambas contas
- [ ] Emails de confirmação enviados corretamente

---

### 🚨 Problemas Comuns

| Problema | Solução |
|----------|---------|
| "Webhook signature inválida" | Verificar se secret em .env está correto |
| "Preço não encontrado" | Criar preços em PF e salvar IDs em .env |
| "Subscription not found" | Usar `identifySubscriptionAccount()` |
| Webhook não recebido | Verificar URL do webhook no dashboard |
| Teste local não funciona | Usar `stripe listen` ou ngrok |

---

### 📞 Perguntas Frequentes

**P: Como saber qual conta usar?**
R: 
- CRIAÇÃO: Sempre PF
- RENOVAÇÃO: Sempre PF
- CANCELAMENTO: Usar `identifySubscriptionAccount()`
- WEBHOOK: Sistema detecta automaticamente

**P: Posso testar sem mudar o código?**
R: Sim! Use `stripe listen` para simular webhooks localmente

**P: E se eu não criar os preços em PF?**
R: Vai falhar com "Price not configured". Criar preços é essencial!

**P: Como migro clientes de PJ para PF?**
R: Veja seção "FASE 5: MIGRAÇÃO DE DADOS"

---

### 📚 Documentação Adicional

- [STRIPE_ARCHITECTURE.md](./STRIPE_ARCHITECTURE.md) - Arquitetura detalhada
- [STRIPE_INTEGRATION_EXAMPLES.js](./STRIPE_INTEGRATION_EXAMPLES.js) - Exemplos de código
- [lib/stripeService.js](./lib/stripeService.js) - Implementação do serviço

---

### ✅ Próximos Passos

1. Copiar/preencher as variáveis de `.env`
2. Atualizar os routes restantes (Cancelsubscription, Renewvip, etc)
3. Testar com Stripe CLI
4. Deploy em produção
5. Monitorar logs de webhook

