import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const directory = process.argv[2] || 'public/catalog'
const files = fs.readdirSync(directory).filter(file => /^p(?:0[4-9]|[12]\d|3[0-2])-\d+\.png$/.test(file))

for (const file of files) {
  const input = path.join(directory, file)
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  for (let index = 0; index < data.length; index += 4) {
    const brightness = Math.max(data[index], data[index + 1], data[index + 2])
    if (brightness <= 12) data[index + 3] = 0
    else if (brightness < 42) data[index + 3] = Math.round(data[index + 3] * ((brightness - 12) / 30))
  }
  const temp = `${input}.tmp.png`
  await sharp(data, { raw: info }).png({ compressionLevel: 9, palette: true, quality: 90 }).toFile(temp)
  fs.renameSync(temp, input)
  console.log(`Cleaned ${file}`)
}
