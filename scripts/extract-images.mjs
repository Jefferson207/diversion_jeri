import fs from 'node:fs'
import path from 'node:path'
import mupdf from 'mupdf'

const source = process.argv[2]
const output = process.argv[3] || 'public/catalog'
if (!source) throw new Error('Usage: node scripts/extract-images.mjs <pdf> [output]')

fs.mkdirSync(output, { recursive: true })
const document = mupdf.Document.openDocument(fs.readFileSync(source), 'application/pdf')
const manifest = []

for (let pageIndex = 0; pageIndex < document.countPages(); pageIndex += 1) {
  const page = document.loadPage(pageIndex)
  let imageIndex = 0
  page.toStructuredText('preserve-images').walk({
    onImageBlock(bbox, transform, image) {
      try {
        const pixmap = image.toPixmap()
        if (pixmap.getWidth() < 100 || pixmap.getHeight() < 100) return
        imageIndex += 1
        const filename = `p${String(pageIndex + 1).padStart(2, '0')}-${imageIndex}.png`
        fs.writeFileSync(path.join(output, filename), pixmap.asPNG())
        manifest.push({ page: pageIndex + 1, filename, bbox, transform, width: pixmap.getWidth(), height: pixmap.getHeight() })
      } catch (error) {
        console.warn(`Skipped image on page ${pageIndex + 1}: ${error.message}`)
      }
    },
  })
}

fs.writeFileSync(path.join(output, 'manifest.json'), JSON.stringify(manifest, null, 2))
console.log(`Extracted ${manifest.length} images`)
