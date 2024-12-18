import React from 'react';
import { formatCurrency } from '../utils/formatCurrency';

interface InvoiceTotalProps {
  total: number;
  currency: "NOK" | "USD" | "EUR";
}

export function InvoiceTotal({ total, currency }: InvoiceTotalProps) {
  const vatRate = 0.25; // 25% VAT rate
  const totalExcludingVAT = total;
  const vatAmount = total * vatRate;
  const totalIncludingVAT = total + vatAmount;

  return (
    <div className="flex justify-end">
      <div className="w-full sm:w-1/2 md:w-1/3 space-y-2">
        <div className="flex justify-between py-2">
          <span className="text-sm text-gray-600">Total ekskludert MVA</span>
          <span className="font-medium">
            {formatCurrency({ amount: totalExcludingVAT, currency })}
          </span>
        </div>
        <div className="flex justify-between py-2 border-t border-gray-200">
          <span className="text-sm text-gray-600">MVA (25%)</span>
          <span className="font-medium">
            {formatCurrency({ amount: vatAmount, currency })}
          </span>
        </div>
        <div className="flex justify-between py-2 border-t border-gray-200">
          <span className="text-sm text-gray-600">Total med MVA ({currency})</span>
          <span className="font-medium underline underline-offset-2">
            {formatCurrency({ amount: totalIncludingVAT, currency })}
          </span>
        </div>
      </div>
    </div>
  );
}

