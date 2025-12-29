#!/usr/bin/env bash
# STRIPE MULTI-CONTA - DIAGRAMAS VISUAIS

cat << 'EOF'

╔══════════════════════════════════════════════════════════════════════════════╗
║                  SEVENXLEAKS - ARQUITETURA STRIPE MULTI-CONTA               ║
╚══════════════════════════════════════════════════════════════════════════════╝

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                           COMPONENTES PRINCIPAIS                            ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

1. lib/stripeService.js
   ├─ getStripeInstance(operation, context)
   │  └─ Retorna qual Stripe usar (PJ ou PF)
   ├─ verifyWebhookSignature(body, sig)
   │  └─ Valida webhook com ambas contas
   ├─ identifySubscriptionAccount(subId)
   │  └─ Encontra qual conta tem assinatura
   └─ getPriceId(tier, plan)
      └─ Recupera preço (sempre PF)

2. routes/payment.js (CRIAÇÃO)
   └─ stripePF.checkout.sessions.create()

3. routes/stripewebhook.js (WEBHOOKS)
   └─ verifyWebhookSignature() detecta conta

4. .env (CONFIGURAÇÃO)
   ├─ STRIPE_SECRET_KEY_PJ/PF
   ├─ STRIPE_WEBHOOK_SECRET_PJ/PF
   └─ STRIPE_PRICEID_PF_*


┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                        FLUXO DE OPERAÇÕES                                  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

CRIAÇÃO DE ASSINATURA (Sempre PF)
─────────────────────────────────

         Cliente
            │
            │ POST /vip-payment
            ▼
    ┌──────────────────┐
    │ payment.js       │
    ├──────────────────┤
    │ • Valida email   │
    │ • Verifica user  │
    │ • getPriceId()   │
    └────────┬─────────┘
             │
             │ getStripeInstance('create')
             ▼
        ╔════════════╗
        ║  stripePF  ║ ◄─── SEMPRE AQUI
        ╚═════┬══════╝
              │ checkout.sessions.create()
              ▼
         Stripe PF
         Checkout
             │
             ▼
        Redireciona
        Cliente para
        Stripe


RENOVAÇÃO DE ASSINATURA (Sempre PF)
─────────────────────────────────

         Cliente
            │
            │ PUT /renew
            ▼
   ┌──────────────────┐
   │ renewvip.js      │
   ├──────────────────┤
   │ getStripeInstance │
   │ ('renew')         │
   └────────┬─────────┘
            │
            ▼
       ╔════════════╗
       ║  stripePF  ║ ◄─── SEMPRE AQUI
       ╚═════┬══════╝
             │ subscriptions.update()
             ▼
         Stripe PF
         Atualiza
         Assinatura


CANCELAMENTO (Depende da Conta)
─────────────────────────────

      Cliente
         │
         │ DELETE /cancel-subscription
         ▼
┌────────────────────────┐
│ cancelsubscription.js  │
├────────────────────────┤
│ identifySubscription   │
│ Account(subId)         │
└───────┬────────────────┘
        │
        ▼ É PJ ou PF?
    ┌───────────┬───────────┐
    │           │           │
    ▼ PJ        ▼ PF        
╔═══════════╗  ╔═══════════╗
║ stripePJ  ║  ║ stripePF  ║
╚═════┬═════╝  ╚═════┬═════╝
      │              │
      ▼              ▼
 subscriptions.del()
      │
      ▼
  Cancelado


WEBHOOK (Detecta Automaticamente)
──────────────────────────────────

Stripe PJ ──┐                  ┌─► Processa Legacy
            │ webhook          │
            │ signature        │
            ▼                  │
      ┌──────────────────┐    │
      │ POST /webhook    │    │
      │ (sem URL)        │    │
      ├──────────────────┤    │
      │ verifyWebhook    │    │
      │ Signature()      │    │
      └──────┬───────────┘    │
             │                 │
             │ Tenta PF        │
             ├──────────────────┤
             ├─► Sucesso? PF   │
             │                 │
             │ Se falhar       │
             ├──────────────────┤
             ├─► Tenta PJ      │
             │                 │
             └─► Sucesso? PJ  ◄┴─ Processa

Stripe PF ──┐
            │ webhook
            │ signature
            ▼


┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                     FLUXO DE WEBHOOK                                       ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

┌─────────────────────────────────────────────────────────────────────┐
│                    STRIPE PJ (LEGACY)                               │
│                                                                     │
│  Events:                                                            │
│  • invoice.paid (legacy)                                            │
│  • invoice.payment_failed (legacy)                                  │
│  • customer.subscription.deleted (old)                              │
│  • customer.subscription.updated (old)                              │
│                                                                     │
│  Endpoint:                                                          │
│  POST https://seu-dominio.com/webhook/stripe/pj                   │
│                                                                     │
│  Secret: STRIPE_WEBHOOK_SECRET_PJ                                  │
└────────────┬──────────────────────────────────────────────────────┘
             │
             │ webhook POST
             ▼
       ┌─────────────────┐
       │ stripewebhook   │
       │ .post('/')      │
       └────────┬────────┘
                │
                │ verifyWebhookSignature()
                ▼
          ┌─────────────┐
          │ Tenta whsec │
          │ _PF         │
          └──┬────────┬─┘
             │        │
          SIM│        │NÃO
             ▼        ▼
        [PF]    Tenta whsec_PJ
                 (sucesso)
                ║
                ║
                ║ [PJ]
                ║
                ▼
        Processa evento
        • invoice.paid
        • subscription.deleted


┌─────────────────────────────────────────────────────────────────────┐
│                    STRIPE PF (NOVA)                                 │
│                                                                     │
│  Events:                                                            │
│  • checkout.session.completed (novo)                                │
│  • invoice.paid (novo)                                              │
│  • invoice.payment_failed (novo)                                    │
│  • customer.subscription.deleted (new)                              │
│  • customer.subscription.updated (new)                              │
│                                                                     │
│  Endpoint:                                                          │
│  POST https://seu-dominio.com/webhook/stripe/pf                   │
│                                                                     │
│  Secret: STRIPE_WEBHOOK_SECRET_PF                                  │
└────────────┬──────────────────────────────────────────────────────┘
             │
             │ webhook POST
             ▼
       ┌─────────────────┐
       │ stripewebhook   │
       │ .post('/')      │
       └────────┬────────┘
                │
                │ verifyWebhookSignature()
                ▼
          ┌─────────────┐
          │ Tenta whsec │
          │ _PF         │
          └──┬────────┬─┘
             │        │
          SIM│        │NÃO
             ▼        ▼
        [PF]   Tenta whsec_PJ
               (falha)
                │
                ▼
        Processa evento
        • checkout.session.completed
        • invoice.paid
        • subscription.deleted


┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                    MATRIZ DE DECISÃO                                       ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

┌─────────────────┬───────────┬──────────────────────┐
│ OPERAÇÃO        │ CONTA     │ FUNÇÃO               │
├─────────────────┼───────────┼──────────────────────┤
│ CRIAR           │ PF        │ payment.js           │
│ RENOVAR         │ PF        │ renewvip.js          │
│ CANCELAR NOVO   │ PF        │ cancelsubscription   │
│ CANCELAR LEGACY │ PJ        │ .js                  │
│ WEBHOOK NOVO    │ PF        │ stripewebhook.js     │
│ WEBHOOK LEGACY  │ PJ        │ (auto-detectado)     │
│ PORTAL          │ PF ou PJ  │ stripeCustomer       │
│                 │ (detect)  │ Portal.js            │
└─────────────────┴───────────┴──────────────────────┘


┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                    ESTADO DO BANCO DE DADOS                                ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

Tabela: Users

┌──────────────────────────────────────────────────┐
│ id                  │ user_id_unique              │
├──────────────────────────────────────────────────┤
│ email               │ user@example.com            │
├──────────────────────────────────────────────────┤
│ stripeCustomerId    │ cus_XXXXX (PJ)            │
├──────────────────────────────────────────────────┤
│ stripeCustomerIdNew │ cus_YYYYY (PF) - opcional │
├──────────────────────────────────────────────────┤
│ stripeSubscriptionId│ sub_XXXXX (PJ)            │
├──────────────────────────────────────────────────┤
│ stripeSubscriptionId│ sub_YYYYY (PF) - opcional │
│ New                 │                             │
├──────────────────────────────────────────────────┤
│ stripeAccountOrigin │ 'pj' ou 'pf'              │
│ (NOVO)              │ (rastreia origem)         │
├──────────────────────────────────────────────────┤
│ isVip               │ true/false                  │
├──────────────────────────────────────────────────┤
│ vipExpirationDate   │ timestamp                   │
├──────────────────────────────────────────────────┤
│ vipTier             │ 'diamond' / 'lifetime'      │
├──────────────────────────────────────────────────┤
│ subscriptionType    │ 'monthly' / 'annual'        │
└──────────────────────────────────────────────────┘


EXEMPLO DE USUÁRIO LEGADO (PJ):
  stripeAccountOrigin = 'pj'
  stripeCustomerId = 'cus_ABC123'
  stripeSubscriptionId = 'sub_ABC123'
  isVip = true
  vipExpirationDate = 2025-12-31

EXEMPLO DE NOVO USUÁRIO (PF):
  stripeAccountOrigin = 'pf'
  stripeCustomerIdNew = 'cus_XYZ789'
  stripeSubscriptionIdNew = 'sub_XYZ789'
  isVip = true
  vipExpirationDate = 2026-12-31


┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                    FLUXO COMPLETO: DO CHECKOUT À RENOVAÇÃO                ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

NOVO CLIENTE:

1. Cliente clica "Comprar VIP Diamond Monthly"
   │
2. POST /vip-payment (email, vipTier='diamond', planType='monthly')
   │
3. payment.js valida e chama:
   • stripeService.getStripeInstance('create') → stripePF
   • stripeService.getPriceId('diamond', 'monthly')
   │
4. stripePF.checkout.sessions.create() → URL de checkout
   │
5. Cliente é redirecionado para Stripe Checkout (PF)
   │
6. Cliente completa pagamento em Stripe PF
   │
7. Stripe PF envia webhook: checkout.session.completed
   │
8. POST /webhook/stripe/pf recebe evento
   │
9. verifyWebhookSignature() valida com STRIPE_WEBHOOK_SECRET_PF ✓
   │
10. stripewebhook.js processa:
    • Encontra User por email
    • Atualiza: stripeCustomerId, stripeSubscriptionId
    • Marca: stripeAccountOrigin = 'pf'
    │
11. Após 1 mês: Stripe PF cobra pagamento automático
    │
12. Stripe PF envia webhook: invoice.paid
    │
13. POST /webhook/stripe/pf recebe evento
    │
14. stripewebhook.js processa invoice.paid:
    • Encontra User
    • Atualiza vipExpirationDate = próximo período
    • Marca isVip = true
    │
15. Cliente mantém acesso VIP


CLIENTE LEGADO (CANCELAMENTO):

1. Cliente com assinatura PJ quer cancelar
   │
2. POST /cancel-subscription (subscriptionId='sub_PJ_ABC')
   │
3. cancelsubscription.js chama:
   • identifySubscriptionAccount('sub_PJ_ABC')
   │
4. Verifica em stripePF → não encontrado
   │
5. Verifica em stripePJ → encontrado!
   │
6. Retorna account = 'pj'
   │
7. getStripeInstance('cancel', { isLegacy: true }) → stripePJ
   │
8. stripePJ.subscriptions.del('sub_PJ_ABC')
   │
9. Stripe PJ envia webhook: customer.subscription.deleted
   │
10. POST /webhook/stripe/pj recebe evento
    │
11. verifyWebhookSignature() valida com STRIPE_WEBHOOK_SECRET_PJ ✓
    │
12. stripewebhook.js processa:
    • Marca isVip = false
    • Limpa vipExpirationDate
    │
13. Cliente perde acesso VIP


┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                    CHECKLIST VISUAL                                        ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

CONFIGURAÇÃO STRIPE:

[✓] Conta PJ criada e ativa
[✓] Webhooks PJ configurados
[✓] Secret Key PJ copiado
[✓] Webhook Secret PJ copiado
[✓] Conta PF criada e ativa
[✓] Webhooks PF configurados
[✓] Secret Key PF copiado
[✓] Webhook Secret PF copiado
[✓] Preços criados em PF (Diamond Monthly/Annual, Lifetime)
[✓] Price IDs copiados de PF

CÓDIGO BACKEND:

[✓] lib/stripeService.js criado
[✓] routes/payment.js atualizado
[✓] routes/stripewebhook.js atualizado
[✓] .env atualizado com variáveis

TESTES:

[ ] Stripe CLI rodando (PJ listener)
[ ] Stripe CLI rodando (PF listener)
[ ] npm start funcionando
[ ] Criar checkout em PF
[ ] Simular checkout.session.completed
[ ] Simular invoice.paid
[ ] Testar cancelamento em PF
[ ] Testar cancelamento em PJ

DOCUMENTAÇÃO CONSULTADA:

[✓] README_STRIPE_MULTI_CONTA.md
[✓] STRIPE_ARCHITECTURE.md
[✓] STRIPE_SETUP_GUIDE.md
[✓] STRIPE_INTEGRATION_EXAMPLES.js
[✓] STRIPE_TEST_EXAMPLES.js
[✓] STRIPE_CHECKLIST.sh
[✓] STRIPE_TECHNICAL_SUMMARY.md

EOF

exit 0
