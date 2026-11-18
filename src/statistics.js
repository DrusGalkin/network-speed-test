const bytesPerMiB = 1024 ** 2;

export function summarizeDownloads(measurements) {
  let totalBytes = 0;
  let totalTimeMs = 0;

  for (const { bytes, durationMs } of measurements) {
    totalBytes += bytes;
    totalTimeMs += durationMs;
  }

  return {
    totalBytes,
    averageTimeMs: totalTimeMs / measurements.length,
    speedMiBps: (totalBytes / bytesPerMiB) / (totalTimeMs / 1000),
  };
}
