import pdfParse from "pdf-parse";

export async function fetchPdfBuffer(url: string): Promise<Buffer> {
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) {
    throw new Error(`PDF fetch ${url} → ${res.status}`);
  }
  const arrayBuf = await res.arrayBuffer();
  return Buffer.from(arrayBuf);
}

export async function extractTotalInklMwStChf(
  pdfBuffer: Buffer
): Promise<number> {
  const data = await pdfParse(pdfBuffer);
  const text = data.text;

  // Match various German invoice formats for the gross total (inkl. MwSt.)
  // Swiss format uses ' as thousands separator: 6'486.00
  const patterns = [
    /Rechnungsbetrag\s+in\s+CHF\s+inkl\.\s*MwSt\.\s*([\d'',.]+)/i,
    /Total\s+Betrag\s+inkl\.\s*MwSt\.\s*(?:in\s*)?CHF\s*[:\s]*([\d'',.]+)/i,
    /Betrag\s+inkl\.\s*MwSt\.\s*(?:in\s*)?CHF\s*[:\s]*([\d'',.]+)/i,
    /inkl\.\s*MwSt\.\s*([\d'',.]+)/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const raw = match[1].trim();
      const normalized = raw.replace(/[''']/g, "").replace(",", ".");
      const value = parseFloat(normalized);
      if (!isNaN(value)) {
        console.log(`  PDF total extracted: "${raw}" → ${value}`);
        return value;
      }
    }
  }

  const snippet = text.substring(0, 2000);
  throw new Error(
    `Could not extract gross total (inkl. MwSt.) from PDF.\nFirst 2000 chars:\n${snippet}`
  );
}
