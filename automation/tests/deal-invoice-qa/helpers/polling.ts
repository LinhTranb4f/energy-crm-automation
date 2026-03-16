/**
 * Polling utility for async workflow verification.
 * Use after HubSpot stage changes to wait for workflows/n8n to complete.
 */

export interface WaitForConditionOptions {
  timeoutMs: number;
  intervalMs: number;
  description: string;
}

const DEFAULT_OPTIONS: Partial<WaitForConditionOptions> = {
  intervalMs: 2000,
  description: "condition",
};

/**
 * Polls checkFn until it returns true or timeout is reached.
 * @throws Error with description if timeout is reached
 */
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
