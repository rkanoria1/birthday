import { cpSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = process.cwd()
const exportedSite = resolve(root, 'out')
const deployment = resolve(root, 'dist')
const client = resolve(deployment, 'client')
const server = resolve(deployment, 'server')

rmSync(deployment, { recursive: true, force: true })
mkdirSync(server, { recursive: true })
cpSync(exportedSite, client, { recursive: true })

writeFileSync(resolve(server, 'index.js'), `export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request)
    if (response.status !== 404) return response

    const url = new URL(request.url)
    if (url.pathname.includes('.')) return response

    const pathname = url.pathname.endsWith('/') ? url.pathname : url.pathname + '/'
    return env.ASSETS.fetch(new Request(url.origin + pathname + 'index.html', request))
  },
}\n`)
