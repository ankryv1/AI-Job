import puppeteer from "puppeteer";

export const generatePdfFromHtml = async (htmlContent) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage"
    ]
  });

  const page = await browser.newPage();

  await page.setContent(htmlContent, { waitUntil: "networkidle0" });
  await page.emulateMediaType("print");

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true
  });

  await browser.close();

  return pdfBuffer;
};