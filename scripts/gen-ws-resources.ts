/**
 * Generates ws-resources.json for Walrus Site deployment.
 *
 * - Sets Cache-Control: immutable on hashed assets (js/css/wasm)
 * - Sets no-cache on HTML entry points
 * - Ignores .gz/.br compressed files (not needed on Walrus)
 * - Configures multi-page routing
 *
 * Run: bun run scripts/gen-ws-resources.ts
 */

import { readdirSync, statSync, writeFileSync, existsSync, readFileSync } from 'node:fs'
import { join, relative, extname } from 'node:path'

const DIST_DIR = join(import.meta.dirname, '..', 'dist')
const OUTPUT = join(DIST_DIR, 'ws-resources.json')

// Collect all files recursively
function walkDir(dir: string): string[] {
  const files: string[] = []
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) {
      files.push(...walkDir(full))
    } else {
      files.push(full)
    }
  }
  return files
}

const allFiles = walkDir(DIST_DIR).map((f) => '/' + relative(DIST_DIR, f))

// Build headers map
const headers: Record<string, Record<string, string>> = {}

for (const file of allFiles) {
  // Skip compressed files entirely
  if (file.endsWith('.gz') || file.endsWith('.br')) continue

  const ext = extname(file)

  // Hashed assets in /assets/ — cache forever
  if (file.startsWith('/assets/')) {
    if (ext === '.js') {
      headers[file] = {
        'Content-Type': 'application/javascript; charset=utf-8',
        'Cache-Control': 'max-age=31536000, immutable',
      }
    } else if (ext === '.css') {
      headers[file] = {
        'Content-Type': 'text/css; charset=utf-8',
        'Cache-Control': 'max-age=31536000, immutable',
      }
    } else if (ext === '.wasm') {
      headers[file] = {
        'Content-Type': 'application/wasm',
        'Cache-Control': 'max-age=31536000, immutable',
      }
    }
  }

  // HTML entry points — never cache
  if (ext === '.html') {
    headers[file] = {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-cache',
    }
  }
}

// Routes for multi-page app (each page handles its own sub-routes)
const routes: Record<string, string> = {
  '/dashboard/*': '/dashboard.html',
  '/create-form/*': '/create-form.html',
  '/form/*': '/form.html',
  '/*': '/index.html',
}

// Ignore patterns — skip .gz/.br files from being uploaded to Walrus
const ignore = ['/*.gz', '/*.br', '/assets/*.gz', '/assets/*.br']

// Preserve existing object_id if ws-resources.json already exists in dist
let objectId: string | undefined
if (existsSync(OUTPUT)) {
  try {
    const existing = JSON.parse(readFileSync(OUTPUT, 'utf-8'))
    objectId = existing.object_id
  } catch {
    // ignore parse errors
  }
}

const wsResources: Record<string, unknown> = {
  headers,
  routes,
  ignore,
  metadata: {
    link: 'https://taskform.wal.app',
    description: 'TaskForm — Decentralized task & form platform on Sui',
    project_url: 'https://github.com/nicetomytyuk/taskform',
    creator: 'TaskForm Team',
  },
  site_name: 'TaskForm',
}

if (objectId) {
  wsResources.object_id = objectId
}

writeFileSync(OUTPUT, JSON.stringify(wsResources, null, 2) + '\n')

const assetCount = Object.keys(headers).filter((k) => k.startsWith('/assets/')).length
const htmlCount = Object.keys(headers).filter((k) => k.endsWith('.html')).length
console.log(`✓ ws-resources.json generated`)
console.log(`  ${assetCount} assets with Cache-Control: immutable`)
console.log(`  ${htmlCount} HTML files with Cache-Control: no-cache`)
console.log(`  ${ignore.length} ignore patterns (skip .gz/.br)`)

// === Cost Estimation ===
// Calculate total size of files that will be uploaded (excluding .gz/.br)
const uploadFiles = walkDir(DIST_DIR).filter((f) => !f.endsWith('.gz') && !f.endsWith('.br'))

let totalBytes = 0
let fileCount = 0
for (const f of uploadFiles) {
  totalBytes += statSync(f).size
  fileCount++
}

const totalMB = totalBytes / (1024 * 1024)
const totalGB = totalBytes / (1024 * 1024 * 1024)

// Walrus pricing constants
const USD_PER_GB_PER_MONTH = 0.023
const EPOCH_DURATION_DAYS = 14 // mainnet epoch ≈ 2 weeks
const MONTHS_PER_EPOCH = EPOCH_DURATION_DAYS / 30

// Walrus uses ~5x erasure coding expansion (already included in pricing)
// site-builder uses Quilt (batches files into 1 blob) → 1 blob transaction set

// Estimate WAL cost (storage only, upload fee is small)
const epochs = Number(process.argv[2]) || 100
const totalMonths = epochs * MONTHS_PER_EPOCH
const storageCostUSD = totalGB * USD_PER_GB_PER_MONTH * totalMonths

// SUI gas estimate: site-builder uses Quilt → ~3-5 transactions total
// Typical gas per tx: 0.01-0.05 SUI
const estimatedSuiGas = 0.15 // conservative estimate for full deploy

console.log(``)
console.log(`💰 Cost Estimate (${epochs} epochs ≈ ${Math.round(totalMonths)} months):`)
console.log(`  Files to upload: ${fileCount} (${totalMB.toFixed(1)} MB)`)
console.log(`  Storage cost:    ~$${storageCostUSD.toFixed(4)} USD (paid in WAL)`)
console.log(`  SUI gas:         ~${estimatedSuiGas} SUI (3-5 transactions)`)
console.log(``)
console.log(`  📝 Note: WAL amount depends on current WAL/USD price.`)
console.log(`     Check: https://costcalculator.wal.app/`)
