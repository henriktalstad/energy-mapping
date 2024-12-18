interface iAppProps {
  amount: number;
  currency: "NOK" | "USD" | "EUR";
}

export function formatCurrency({ amount, currency }: iAppProps) {
  return new Intl.NumberFormat("no-NO", {
    style: "currency",
    currency: currency,
  }).format(amount);
}
