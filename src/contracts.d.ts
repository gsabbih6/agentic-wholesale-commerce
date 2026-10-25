/** Reference boundaries only; validation and implementations are not included. */
export type ApprovalMode = "manual" | "delegated" | "exceptions_only";
export type ApprovalDecision = "approved" | "requires_human" | "rejected";

export interface AgentIdentity {
  agentId: string;
  merchantId: string;
  role: "buyer" | "supplier";
}

export interface DealTerms {
  negotiationId: string;
  revision: number;
  termsHash: string;
  productId: string;
  quantity: number;
  totalBaseUnits: string;
  asset: "RLUSD";
  network: "eip155:1449000";
  deliveryDeadline: string;
}

export interface NegotiationTransport {
  send(actor: AgentIdentity, command: {
    operationId: string;
    negotiationId: string;
    expectedVersion: number;
    type: "rfq.submit" | "quote.propose" | "terms.counter" | "deal.request_review";
    payload: unknown;
  }): Promise<{ operationId: string; version: number }>;
}

export interface MerchantApprovalPolicy {
  readonly mode: ApprovalMode;
  evaluate(terms: DealTerms): Promise<ApprovalDecision>;
}

export interface ReservationAndOrderService {
  /** Implementation must verify both parties' exact-term authority atomically. */
  reserveAndCreateOrder(terms: DealTerms, operationId: string): Promise<{ orderId: string }>;
}

export interface PaymentAdapter {
  /** Implementation must recheck authority, capacity and immutable destination. */
  payAuthorizedOrder(orderId: string): Promise<{
    orderId: string;
    status: "pending" | "redeemed" | "settled";
    resourceUrl?: string;
    settlementHash?: string;
    payoutHash?: string;
  }>;
}
