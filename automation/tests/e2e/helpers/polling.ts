export interface WaitForConditionOptions {
  timeoutMs: number;
  intervalMs: number;
  description: string;
}

const DEFAULT_OPTIONS: Partial<WaitForConditionOptions> = {
  intervalMs: 2000,
  description: "condition",
};

export async function waitForCondition(
  checkFn: () => Promise<boolean>,
  options: WaitForConditionOptions,
): Promise<void> {
  const { timeoutMs, intervalMs, description } = {
    ...DEFAULT_OPTIONS,
    ...options,
  } as WaitForConditionOptions;

  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    const ok = await checkFn();
    if (ok) return;
    await new Promise((r) => setTimeout(r, intervalMs));
  }

  throw new Error(
    `waitForCondition timed out after ${timeoutMs}ms waiting for: ${description}`,
  );
}

