# ARQUITETURA STRIPE MULTI-CONTA - RESUMO TÉCNICO

## 📐 Estrutura de Arquivos Criados

```
BACKEND/
├── lib/
│   └── stripeService.js                 ← ✨ NOVO: Orquestrador multi-conta
├── config/
│   └── stripeConfig.js                  ← (Opcional: configurações centralizadas)
├── routes/
│   ├── payment.js                       ← ✏️ ATUALIZADO: Usa stripeService
│   ├── stripewebhook.js                 ← ✏️ ATUALIZADO: Detecta conta automática
│   ├── Cancelsubscription.js            ← ⚠️ TODO: Implementar integração
│   ├── Renewvip.js                      ← ⚠️ TODO: Implementar integração
│   └── stripeCustomerPortal.js          ← ⚠️ TODO: Implementar integração
├── .env                                 ← ✏️ ATUALIZADO: Variáveis PJ e PF
├── STRIPE_ARCHITECTURE.md               ← 📖 NOVO: Documentação detalhada
├── README_STRIPE_MULTI_CONTA.md         ← 📖 NOVO: Resumo executivo
├── STRIPE_SETUP_GUIDE.md                ← 📖 NOVO: Guia passo-a-passo
├── STRIPE_INTEGRATION_EXAMPLES.js       ← 💡 NOVO: Exemplos de código
├── STRIPE_TEST_EXAMPLES.js              ← 🧪 NOVO: Exemplos de teste
└── STRIPE_CHECKLIST.sh                  ← ✅ NOVO: Checklist de implementação
```

---

## 🔄 Fluxo de Decisão

```
┌─────────────────────────────────────────────────────────┐
│              OPERAÇÃO STRIPE SOLICITADA                  │
└─────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┼─────────────┐
                ▼             ▼             ▼
            CRIAR?         RENOVAR?     CANCELAR?
              │              │             │
              │              │             └─────────────────┐
              │              │                                 │
              ▼              ▼                                 ▼
         stripePF        stripePF                 identifySubscriptionAccount()
        (SEMPRE)        (SEMPRE)                           │
                                                ┌──────────┴──────────┐
                                                ▼                     ▼
                                            stripePF            stripePJ
                                           (Nova)             (Legacy)
```

---

## 🎯 Funções do stripeService.js

| Função | Retorna | Uso |
|--------|---------|-----|
| `getStripeInstance(op, ctx)` | `{ stripe, account }` | Obter Stripe correto |
| `verifyWebhookSignature(body, sig)` | `{ event, stripe, account }` | Validar webhook |
| `identifySubscriptionAccount(subId)` | `'pj' \| 'pf'` | Encontrar conta de sub |
| `getPriceId(tier, plan)` | `string` | Recuperar price ID |

---

## 📊 Variáveis de Ambiente

```
STRIPE_SECRET_KEY_PJ              # Secret PJ (obrigatório)
STRIPE_WEBHOOK_SECRET_PJ          # Webhook PJ (obrigatório)
STRIPE_SECRET_KEY_PF              # Secret PF (obrigatório)
STRIPE_WEBHOOK_SECRET_PF          # Webhook PF (obrigatório)
STRIPE_PRICEID_PF_DIAMOND_MONTHLY # Price PF (obrigatório)
STRIPE_PRICEID_PF_DIAMOND_ANNUAL  # Price PF (obrigatório)
STRIPE_PRICEID_PF_LIFETIME        # Price PF (obrigatório)
WEBHOOK_DOMAIN                    # URL pública (opcional)
```

---

## ✅ O QUE JÁ FOI FEITO

| Item | Status | Detalhes |
|------|--------|----------|
| stripeService.js | ✅ Criado | Orquestrador multi-conta com 4 funções principais |
| payment.js | ✅ Refatorado | Usa stripeService, remove TITANIUM |
| stripewebhook.js | ✅ Refatorado | Detecta conta automaticamente |
| .env | ✅ Atualizado | Variáveis de ambas contas |
| Documentação | ✅ Completa | 5 arquivos .md com guias |
| Exemplos | ✅ Inclusos | Padrões de integração |
| Cancelsubscription | ⏳ Pendente | Ver STRIPE_INTEGRATION_EXAMPLES.js |
| Renewvip | ⏳ Pendente | Ver STRIPE_INTEGRATION_EXAMPLES.js |
| stripeCustomerPortal | ⏳ Pendente | Ver STRIPE_INTEGRATION_EXAMPLES.js |

---

## 🚀 INSTRUÇÕES RÁPIDAS

### 1. Preencher .env
```bash
# Contas Stripe
STRIPE_SECRET_KEY_PJ=sk_test_xxx
STRIPE_WEBHOOK_SECRET_PJ=whsec_xxx
STRIPE_SECRET_KEY_PF=sk_test_yyy
STRIPE_WEBHOOK_SECRET_PF=whsec_yyy

# Preços PF (criar em Stripe PF Dashboard)
STRIPE_PRICEID_PF_DIAMOND_MONTHLY=price_xxx
STRIPE_PRICEID_PF_DIAMOND_ANNUAL=price_xxx
STRIPE_PRICEID_PF_LIFETIME=price_xxx
```

### 2. Testar Localmente
```bash
# Terminal 1
stripe listen --forward-to localhost:3000/webhook/stripe/pj

# Terminal 2
stripe listen --forward-to localhost:3000/webhook/stripe/pf

# Terminal 3
npm start
```

### 3. Integrar Outros Routes
Copiar padrão de STRIPE_INTEGRATION_EXAMPLES.js para:
- Cancelsubscription.js
- Renewvip.js
- stripeCustomerPortal.js

---

## 🧠 Lógica de Decisão

### CRIAÇÃO (POST /vip-payment)
```javascript
const { stripe } = stripeService.getStripeInstance('create');
// Sempre stripePF - novas assinaturas
```

### RENOVAÇÃO (PUT /renew-subscription)
```javascript
const { stripe } = stripeService.getStripeInstance('renew');
// Sempre stripePF - renovações
```

### CANCELAMENTO (DELETE /cancel-subscription)
```javascript
const account = await stripeService.identifySubscriptionAccount(subId);
const { stripe } = stripeService.getStripeInstance('cancel', { 
  isLegacy: account === 'pj' 
});
// Pode ser PJ ou PF
```

### WEBHOOK (POST /webhook)
```javascript
const { event, stripe, account } = stripeService.verifyWebhookSignature(
  body, 
  sig
);
// Detecta automaticamente - PJ ou PF
```

---

## 📋 PRÓXIMOS PASSOS RECOMENDADOS

1. **Immediate** (hoje):
   - [ ] Preencher .env com chaves Stripe
   - [ ] Criar preços em PF
   - [ ] Configurar webhooks em ambos dashboards

2. **Short term** (esta semana):
   - [ ] Testar com Stripe CLI
   - [ ] Integrar Cancelsubscription.js
   - [ ] Integrar Renewvip.js
   - [ ] Integrar stripeCustomerPortal.js

3. **Medium term** (próximas semanas):
   - [ ] Testes em staging
   - [ ] Testes de failover
   - [ ] Monitoramento de webhooks
   - [ ] Documentação de runbook

4. **Long term** (próximos meses):
   - [ ] Migração de clientes PJ → PF (se necessário)
   - [ ] Sunset da conta PJ (quando todos migrarem)
   - [ ] Análise de custos/benefícios

---

## 🔒 SEGURANÇA

✅ Duas webhook secrets separadas
✅ Chaves secretas nunca expostas
✅ Validação de signature em ambas contas
✅ Identificação automática previne erros

⚠️ Nunca commitar .env com chaves reais
⚠️ Usar variáveis de ambiente em produção

---

## 📞 SUPORTE

Para dúvidas, consulte:
1. [README_STRIPE_MULTI_CONTA.md](./README_STRIPE_MULTI_CONTA.md) - Visão geral
2. [STRIPE_ARCHITECTURE.md](./STRIPE_ARCHITECTURE.md) - Detalhes técnicos
3. [STRIPE_SETUP_GUIDE.md](./STRIPE_SETUP_GUIDE.md) - Guia passo-a-passo
4. [STRIPE_INTEGRATION_EXAMPLES.js](./STRIPE_INTEGRATION_EXAMPLES.js) - Exemplos código
5. [STRIPE_TEST_EXAMPLES.js](./STRIPE_TEST_EXAMPLES.js) - Testes
6. [STRIPE_CHECKLIST.sh](./STRIPE_CHECKLIST.sh) - Checklist

---

## 📈 STATUS DA IMPLEMENTAÇÃO

```
┌─────────────────────────────────────────────────────┐
│                 STRIPE MULTI-CONTA                  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  [████████████████████░░░░░░░░░░░░░░░░] 60%       │
│                                                     │
│  ✅ Serviço centralizado (stripeService.js)        │
│  ✅ Autenticação webhook dual                      │
│  ✅ Identificação automática de conta              │
│  ✅ Integração payment.js                          │
│  ✅ Integração stripewebhook.js                    │
│  ✅ Documentação completa                          │
│  ⏳ Integração Cancelsubscription.js               │
│  ⏳ Integração Renewvip.js                         │
│  ⏳ Integração stripeCustomerPortal.js             │
│  ⏳ Testes e-2-e                                   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

Criado em: 29/12/2025
Versão: 1.0
Autor: Arquitetura Stripe Multi-Conta
