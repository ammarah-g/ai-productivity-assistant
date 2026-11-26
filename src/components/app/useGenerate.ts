import { useState } from "react";
type AiResult = { text: string; error?: undefined } | { text?: undefined; error: string };

export function useGenerate<I>(fn: (opts: { data: I }) => Promise<AiResult>, setOutput: (v: string) => void) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const run = async (data: I) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fn({ data });
      if (res.error !== undefined) setError(res.error);
      else setOutput(res.text);
    } catch {
      setError("Please check your inputs and try again.");
    } finally {
      setLoading(false);
    }
  };
  return { loading, error, run };
}
