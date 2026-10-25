# Agentic Wholesale Commerce

**Built with XRPay · Hackathon reference skeleton**

[XRPay website](https://xrpay.it) · [Cloudline](https://github.com/cpayX3/cloudline)

AI agents help merchants restock: discover suppliers, negotiate through Cloudline, request approval, and pay through XRPay using x402, XRPL escrow or optional Mastercard AP4M.

> **Repository scope:** this public repository contains interfaces, adapter placeholders and a static quote-comparison illustration. The product and technical descriptions below describe the private XRPay implementation. The full application, negotiation server, wallet signing and payment execution are not included here.

## Project description

XRPay helps merchants replenish stock through AI agents that coordinate purchasing across businesses.

A merchant describes what they need, their budget and delivery deadline. Their purchasing agent compares suppliers, requests quotes and negotiates with supplier agents. Each merchant can act as both buyer and supplier, with its own inventory, permissions and buying authority.

[Cloudline](https://github.com/cpayX3/cloudline) is one of our communication adapters. It provides an agent-to-agent communication, negotiation and authorization infrastructure layer that enables independent agents to conduct business across platforms. XRPay retains enforcement of merchant permissions and payment authority.

Agreed terms become an actionable purchase inside XRPay. Each merchant chooses manual, delegated or exceptions-only approval. Once both businesses authorize the exact terms under their chosen policies, the system reserves inventory and budget, creates the order and executes the permitted payment route:

- **x402:** upfront payment using XRPay's existing XRPL implementation.
- **XRPL escrow:** conditional payment held until acceptance or an undisputed delivery-review period, with cancellation and refund after expiry when appropriate.
- **Optional Mastercard AP4M:** an additional upfront-payment route using funded spending authority and signed payment approvals.

The conversation follows the purchase through negotiation, approval, payment, shipment and receiving. A read-only admin activity viewer shows recorded agent actions, both sides' approvals and verified payment evidence, with live updates and replay.

Our local demo connects 14 merchants as buyers and suppliers. It combines simulated inventory and delivery events with real testnet transactions. Retry and concurrency checks verify that repeated requests do not create duplicate orders or payments.

XRPay brings agent coordination and transaction execution into one merchant experience, while keeping human authority and payment evidence visible.

## Technical description

XRPay combines a Remix/React interface, PostgreSQL records and BullMQ workers with an OpenAI-powered purchasing agent. Shared procurement services enforce organization scope, approved terms, integer-denominated budgets, inventory reservations and idempotency.

Cloudline is an A2A adapter connecting merchant agents for quote requests, negotiation and approval coordination. HTTP, A2A and Cloudline feed the protocol-neutral negotiation core. Accepted terms feed XRPay's order and payment services.

Payment adapters support native XRPL x402 upfront payments, conditional XRP escrow and optional Mastercard AP4M. Signing stays server-side; uncertain transactions are reconciled before retries. Escrow workers apply delivery-review and dispute rules, while XRPL enforces the condition and ledger deadlines.

A read-only admin viewer streams saved events and validated payment evidence. The demo isolates fixture data and testnet wallets from production, with concurrency and replay tests checking for duplicate orders and payouts.

## Included coffee illustration

Riverside Café needs 10 kg of roasted coffee. The static fixture compares Cedar Coffee & Tea, Harbor, Metro and Hilltop, recommending Metro at 0.96 test RLUSD within a 1 RLUSD budget.

The four supplier agents in the private AP4M demo share **one registered AP4M testnet payout account**. Their negotiation identities and stock are separate; they are not four on-chain AP4M merchants. The AP4M/RLUSD coffee path currently uses rules-based negotiation; AI pricing is used on the native XRP path. This small public illustration does not implement either negotiation engine or the full 14-merchant workspace.

## Run the illustration

Requires Node.js 20 or later. No dependencies, credentials or network access are needed.

```sh
npm run demo
```

This reads static quotes and prints a comparison, recommending Metro at 0.96 test RLUSD. It does not contact agents, grant approval, reserve inventory, create an order or make a payment.

## Repository map

```text
demo/coffee.json           Four fictional supplier quotes
docs/architecture.md      System boundaries and live-demo sequence
src/contracts.d.ts        Transport, approval, order and payment interfaces
src/adapters/              Unimplemented HTTP, A2A and AP4M entry points
src/demo.mjs               Local static quote comparison
.env.example              Public testnet settings only
```

## What to show in the live application

1. Four supplier agents return offers for one restocking request.
2. Merchant approval rules and a hard spending cap control commitment.
3. HTTP 402 and confirmed voucher redemption unlock the supplier resource.
4. Settlement evidence, the RLUSD transfer and an order-bound receipt are visible.
5. An over-limit check is rejected before signing; retries retain the same purchase.

These are capabilities of the private implementation, not implementations supplied by this skeleton. The over-limit demonstration is an adapter check against the funded on-chain cap, not a deliberately reverted transaction.

## References and ownership

- [Mastercard AP4M integration guide](https://hackathon.ap4m.build/integration-guide)
- [A2A project](https://github.com/a2aproject/A2A)
- [Cloudline](https://github.com/cpayX3/cloudline) — agent communication integration used by the private XRPay prototype.

Built as part of XRPay. The wider XRPay platform remains proprietary. No company credentials, customer data, original Git history or third-party SDK source is included. No open-source license is granted by this skeleton. Acceptance of a skeleton-only repository is determined by the hackathon organizers.
