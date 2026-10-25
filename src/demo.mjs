import { readFile } from "node:fs/promises";

const fixture = JSON.parse(await readFile(new URL("../demo/coffee.json", import.meta.url), "utf8"));
const format = amount => {
  const scale = 10n ** BigInt(fixture.decimals);
  const fraction = (amount % scale).toString().padStart(fixture.decimals, "0").replace(/0+$/, "");
  return `${amount / scale}${fraction ? `.${fraction}` : ""}`;
};
const offers = fixture.suppliers.map(s => ({
  ...s,
  total: BigInt(s.unitPriceBaseUnits) * BigInt(fixture.quantityKg),
}));
const eligible = offers.filter(o => o.total <= BigInt(fixture.budgetBaseUnits) && o.deliveryDays <= fixture.maximumDeliveryDays)
  .sort((a, b) => a.total < b.total ? -1 : a.total > b.total ? 1 : a.deliveryDays - b.deliveryDays);

console.log("STATIC ILLUSTRATION — no agent calls, approvals, orders or payments.");
console.log(`${fixture.buyer}: ${fixture.quantityKg} kg ${fixture.product}, budget ${format(BigInt(fixture.budgetBaseUnits))} test RLUSD.`);
console.table(offers.map(o => ({ supplier: o.name, totalTestRlusd: format(o.total), deliveryDays: o.deliveryDays })));
console.log(eligible.length ? `Illustrative recommendation: ${eligible[0].name}, ${format(eligible[0].total)} test RLUSD.` : "No eligible offer.");
console.log(fixture.settlementArrangement);
