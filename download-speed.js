import { measureDownload } from './src/download.js';
import { summarizeDownloads } from './src/statistics.js';

const requestCount = 10;

async function main() {
  const [address, ...extraArgs] = process.argv.slice(2);
  if (!address || extraArgs.length > 0) {
    throw new Error('Укажите один URL: node download-speed.js "https://example.com/image.jpg"');
  }

  const url = URL.parse(address);
  if (!url || !['http:', 'https:'].includes(url.protocol)) {
    throw new Error('Укажите полный URL, начинающийся с http:// или https://.');
  }

  const measurements = [];

  for (let request = 1; request <= requestCount; request++) {
    try {
      measurements.push(await measureDownload(url));
    } catch (error) {
      const detail = error.cause?.code ?? error.message;
      throw new Error(`Запрос ${request} из ${requestCount}: ${detail}`);
    }
  }

  const { averageTimeMs, totalBytes, speedMiBps } = summarizeDownloads(measurements);

  console.log(`Среднее время запроса: ${averageTimeMs.toFixed(2)} мс`);
  console.log(`Общий объём скачанных данных: ${totalBytes} байт`);
  console.log(`Скорость скачивания: ${speedMiBps.toFixed(3)} МиБ/с`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
