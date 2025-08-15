import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import puppeteer from "puppeteer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Input HTML (defaults to v22 at repo root)
const htmlPathArg = process.argv[2] || "dusan_vejnovic_cv_a4_purple_v22.html";
const htmlPath = path.resolve(process.cwd(), htmlPathArg);

// Output PDF
const outDir = path.resolve(process.cwd(), "dist");
const outPath = path.join(outDir, "Dusan_Vejnovic_CV_A4.pdf");

(async () => {
  if (!fs.existsSync(htmlPath)) {
    console.error(`✖ HTML file not found: ${htmlPath}`);
    process.exit(1);
  }
  fs.mkdirSync(outDir, { recursive: true });

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox"
    ]
  });

  try {
    const page = await browser.newPage();

    // Be explicit: render in print mode and load all assets (fonts/css/images)
    await page.emulateMediaType("print");

    // Load file:// URL
    const fileUrl = `file://${htmlPath.replace(/\\/g, "/")}`;
    await page.goto(fileUrl, { waitUntil: ["load", "domcontentloaded", "networkidle0"] });

    // Ensure web fonts (Poppins, Manrope) are fully ready
    try {
      await page.evaluate(async () => {
        if (document.fonts && document.fonts.ready) {
          await document.fonts.ready;
        }
      });
    } catch { /* no-op if fonts API not available */ }

    // Small settle time for any late layout
    await page.waitForTimeout(150);

    // Print using CSS page size (A4 from @page), with backgrounds
    await page.pdf({
      path: outPath,
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
      scale: 1
    });

    console.log(`✔ PDF generated: ${outPath}`);
  } catch (err) {
    console.error("✖ Failed to render PDF:", err);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
})();