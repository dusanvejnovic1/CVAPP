# CVApp

A single-file CV (A4) with a print-safe CSS layout and a one-click GitHub Action to render a PDF.

## Local PDF generation

```bash
npm install
node tools/render-pdf.js
# output: dist/Dusan_Vejnovic_CV_A4.pdf
```

You can target a different HTML file:

```bash
node tools/render-pdf.js path/to/file.html
```

## GitHub Actions

- Actions → “Render CV PDF (A4)” → Run workflow
- Download the `Dusan_Vejnovic_CV_A4` artifact

## Print preview settings (manual)

- Scale: 100%
- Margins: None (or Minimum)
- Background graphics: On