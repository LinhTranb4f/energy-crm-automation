export interface CalculationResult {
  expected_price: number | null;
  expected_quantity: number | null;
  expected_description: string | null;
  expected_internal_orders: string | null;
  expected_revenue_accounts: string | null;
  expected_count_of_targetings?: number | null;
}

export type LineItemProps = Record<string, string | null>;
