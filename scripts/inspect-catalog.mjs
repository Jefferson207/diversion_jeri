import fs from 'node:fs'
import path from 'node:path'
import mupdf from 'mupdf'

const source = process.argv[2]
const output = process.argv[3] || 'catalog-inspect'

if (!source) throw new Error('Usage: node scripts/inspect-catalog.mjs <pdf> [output]')

fs.mkdirSync(output, { recursive: true })
const bytes = fs.readFileSync(source)
const document = mupdf.Document.openDocument(bytes, 'application/pdf')
const pages = []

for (let index = 0; index < document.countPages(); index += 1) {
  const page = document.loadPage(index)
  const text = page.toStructuredText('preserve-whitespace').asText()
  const bounds = page.getBounds()
  const scale = Math.min(1.25, 900 / bounds[2])
  const pixmap = page.toPixmap(mupdf.Matrix.scale(scale, scale), mupdf.ColorSpace.DeviceRGB, false)
  const filename = `page-${String(index + 1).padStart(3, '0')}.png`
  fs.writeFileSync(path.join(output, filename), pixmap.asPNG())
  pages.push({ page: index + 1, filename, text })
  console.log(`Extracted ${index + 1}/${document.countPages()}`)
}

fs.writeFileSync(path.join(output, 'pages.json'), JSON.stringify(pages, null, 2))
