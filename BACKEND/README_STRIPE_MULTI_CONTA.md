# STRIPE MULTI-CONTA - RESUMO EXECUTIVO

## 📊 Visão Geral da Arquitetura

```
┌────────────────────────────────────────────────────────────────────┐
│                        SEVENXLEAKS VIP SYSTEM                       │
└────────────────────────────────────────────────────────────────────┘

                              BACKEND NODE.JS
                ┌──────────────────────────────────────────────────┐
                │                                                    │
    ┌─────────► │  lib/stripeService.js (orquestrador multi-conta) │ ◄─────────┐
    │           │                                                    │           │
    │           └──────────────────────────────────────────────────┘           │
    │                                                                            │
    │                                                                            │
  CRIAÇÃO                                                                    WEBHOOK
  ┌─────────────────────────────────────────────────────────────┐
  │                                                               │
  │  POST /vip-payment                                          │
  │  ├─ Valida email                                            │
  │  ├─ stripeService.getPriceId()                              │
  │  ├─ stripeService.getStripeInstance('create')              │
  │  └─ stripePF.checkout.sessions.create()                    │
  │     └─ Redireciona para checkout PF                        │
  │                                                               │
  └─────────────────────────────────────────────────────────────┘
                              │
                              │ checkout.session.completed
                              ▼
  
  ┌──────────────────────────────────────────────────────────────────┐
  │                     CONTAS STRIPE                                 │
  │                                                                    │
  │  ┌────────────────────────┐      ┌────────────────────────┐     │
  │  │   STRIPE PJ (ANTIGA)   │      │   STRIPE PF (NOVA)     │     │
  │  ├────────────────────────┤      ├────────────────────────┤     │
  │  │ Secret Key: sk_test_PJ │      │ Secret Key: sk_test_PF │     │
  │  │ Webhook: whsec_PJ      │      │ Webhook: whsec_PF      │     │
  │  │                        │      │                        │     │
  │  │ APENAS:                │      │ PARA:                  │     │
  │  │ • Webhooks legados     │      │ • Criar checkout       │     │
  │  │ • Cancelamentos        │      │ • Renovar subscrição   │     │
  │  │ • Consulta legacy      │      │ • Processar webhooks   │     │
  │  │                        │      │ • Novos preços         │     │
  │  └────────────────────────┘      └────────────────────────┘     │
  │         ▲                                    ▲                    │
  │         │                                    │                    │
  └─────────┼────────────────────────────────────┼────────────────────┘
            │                                    │
            │ invoice.paid (legacy)              │ invoice.paid (novo)
            │ subscription.deleted (old)         │ checkout.completed
            │                                    │ subscription.deleted (new)
            │                                    │
    ┌───────┴────────────────────────────────────┴───────┐
    │                                                      │
    │  POST /webhook/stripe/pj (legacy)                  │
    │  POST /webhook/stripe/pf (novo)                    │
    │                                                      │
    │  stripeService.verifyWebhookSignature()            │
    │  ├─ Tenta validar com STRIPE_WEBHOOK_SECRET_PF    │
    │  ├─ Se falhar, tenta com STRIPE_WEBHOOK_SECRET_PJ │
    │  └─ Retorna (event, stripe, account)              │
    │                                                      │
    │  Processa:                                          │
    │  • invoice.paid → Ativa/renova VIP                 │
    │  • checkout.session.completed → Vincula IDs        │
    │  • subscription.deleted → Remove VIP               │
    │                                                      │
    └──────────────────────────────────────────────────────┘
```

---

## 🎯 Decisão de Conta por Operação

| Operação | Conta | Função | Como |
|----------|-------|--------|------|
| **CRIAR** | PF (Nova) | `POST /vip-payment` | `getStripeInstance('create')` → stripePF |
| **RENOVAR** | PF (Nova) | `POST /renew` | `getStripeInstance('renew')` → stripePF |
| **CANCELAR** | Depende | `DELETE /cancel` | `identifySubscriptionAccount()` → PJ ou PF |
| **WEBHOOK** | Auto | `POST /webhook` | `verifyWebhookSignature()` detecta automaticamente |

---

## 🔐 Variáveis de Ambiente Necessárias

```env
# Conta PJ (Antiga)
STRIPE_SECRET_KEY_PJ=sk_test_XXX
STRIPE_WEBHOOK_SECRET_PJ=whsec_XXX

# Conta PF (Nova)
STRIPE_SECRET_KEY_PF=sk_test_YYY
STRIPE_WEBHOOK_SECRET_PF=whsec_YYY

# Preços em PF
STRIPE_PRICEID_PF_DIAMOND_MONTHLY=price_XXX
STRIPE_PRICEID_PF_DIAMOND_ANNUAL=price_XXX
STRIPE_PRICEID_PF_LIFETIME=price_XXX
```

---

## 📁 Arquivos Criados/Atualizados

| Arquivo | Status | Descrição |
|---------|--------|-----------|
| `lib/stripeService.js` | ✅ Criado | Orquestrador multi-conta |
| `routes/payment.js` | ✅ Atualizado | Usa stripePF para criação |
| `routes/stripewebhook.js` | ✅ Atualizado | Detecta conta automaticamente |
| `.env` | ✅ Atualizado | Variáveis de ambas contas |
| `STRIPE_ARCHITECTURE.md` | ✅ Criado | Documentação detalhada |
| `STRIPE_SETUP_GUIDE.md` | ✅ Criado | Guia passo a passo |
| `STRIPE_INTEGRATION_EXAMPLES.js` | ✅ Criado | Exemplos de implementação |

---

## ⚡ Quick Start

### 1. Preencher .env
```bash
STRIPE_SECRET_KEY_PJ=sk_test_seu_pj_secret
STRIPE_WEBHOOK_SECRET_PJ=whsec_seu_pj_webhook
STRIPE_SECRET_KEY_PF=sk_test_seu_pf_secret
STRIPE_WEBHOOK_SECRET_PF=whsec_seu_pf_webhook
STRIPE_PRICEID_PF_DIAMOND_MONTHLY=price_XXX
STRIPE_PRICEID_PF_DIAMOND_ANNUAL=price_XXX
STRIPE_PRICEID_PF_LIFETIME=price_XXX
```

### 2. Testar Localmente
```bash
# Terminal 1: Escutar webhooks PJ
stripe listen --forward-to localhost:3000/webhook/stripe/pj

# Terminal 2: Escutar webhooks PF
stripe listen --forward-to localhost:3000/webhook/stripe/pf

# Terminal 3: Iniciar servidor
npm start
```

### 3. Integrar nos Outros Routes
Ver `STRIPE_INTEGRATION_EXAMPLES.js` para:
- Cancelsubscription.js
- Renewvip.js
- stripeCustomerPortal.js

---

## ✅ O que foi feito

- ✅ Serviço centralizado `stripeService.js` com lógica multi-conta
- ✅ Arquivo `.env` com variáveis separadas por conta (PJ e PF)
- ✅ Documentação de arquitetura (`STRIPE_ARCHITECTURE.md`)
- ✅ Guia passo a passo de setup (`STRIPE_SETUP_GUIDE.md`)
- ✅ Exemplos de integração (`STRIPE_INTEGRATION_EXAMPLES.js`)
- ✅ `payment.js` refatorado para usar stripeService
- ✅ `stripewebhook.js` refatorado para detectar conta
- ✅ TITANIUM comentado (não em uso)

---

## 🚀 Próximos Passos

1. **Preencher .env** com suas chaves Stripe PJ e PF
2. **Criar preços** em PF e copiar IDs para .env
3. **Configurar webhooks** em ambos dashboards
4. **Atualizar outros routes** (Cancelsubscription, Renewvip, etc)
5. **Testar** com Stripe CLI
6. **Deploy** em produção

---

## 📚 Documentação

- [Arquitetura Detalhada](./STRIPE_ARCHITECTURE.md)
- [Guia de Setup](./STRIPE_SETUP_GUIDE.md)
- [Exemplos de Código](./STRIPE_INTEGRATION_EXAMPLES.js)

---

## 🆘 Dúvidas Frequentes

**P: Qual conta devo usar para criar uma assinatura?**  
R: Sempre PF (nova). Use `stripeService.getStripeInstance('create')`

**P: E para renovar?**  
R: Sempre PF. Use `stripeService.getStripeInstance('renew')`

**P: E para cancelar?**  
R: Depende. Use `await stripeService.identifySubscriptionAccount(subId)` para determinar

**P: Como testo webhooks localmente?**  
R: Use `stripe listen --forward-to localhost:3000/webhook/stripe/pj` e `stripe listen --forward-to localhost:3000/webhook/stripe/pf`

