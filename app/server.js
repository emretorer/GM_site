import express from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const app = express()
const port = Number(process.env.PORT) || 8080
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const distDir = path.join(__dirname, 'dist')

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365
const THIRTY_DAYS_SECONDS = 60 * 60 * 24 * 30

app.use(
  '/assets',
  express.static(path.join(distDir, 'assets'), {
    immutable: true,
    maxAge: ONE_YEAR_SECONDS * 1000,
    setHeaders(res) {
      res.setHeader(
        'Cache-Control',
        `public, max-age=${ONE_YEAR_SECONDS}, immutable`
      )
    },
  })
)

app.use(
  express.static(distDir, {
    maxAge: THIRTY_DAYS_SECONDS * 1000,
    setHeaders(res, filePath) {
      if (filePath.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-cache')
        return
      }

      if (!res.getHeader('Cache-Control')) {
        res.setHeader(
          'Cache-Control',
          `public, max-age=${THIRTY_DAYS_SECONDS}`
        )
      }
    },
  })
)

app.use((_req, res) => {
  res.setHeader('Cache-Control', 'no-cache')
  res.sendFile(path.join(distDir, 'index.html'))
})

app.listen(port, () => {
  console.log(`Frontend server listening on port ${port}`)
})
