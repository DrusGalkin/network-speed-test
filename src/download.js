import { performance } from 'node:perf_hooks';

const requestTimeoutMs = 120_000;

export async function measureDownload(url) {
  const startedAt = performance.now();
  const response = await fetch(url, { signal: AbortSignal.timeout(requestTimeoutMs) });

  if (!response.ok) {
    await response.body?.cancel();
    throw new Error(`HTTP ${response.status}`);
  }

  let bytes = 0;
  if (response.body) {
    for await (const chunk of response.body) {
      bytes += chunk.byteLength;
    }
  }

  return { bytes, durationMs: performance.now() - startedAt };
}
