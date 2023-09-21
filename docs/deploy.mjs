import Bundlr from '@bundlr-network/client'
import { WarpFactory, defaultCacheOptions } from 'warp-contracts'
import fs from 'fs'
import Arweave from 'arweave'


const ANT = 'WufH5bUN0PHsFKZ4VPcrPpMIXGnovStQ3TytjSwyDgY'
const arweave = Arweave.init({ host: 'arweave.net', port: 443, protocol: 'https' })
//const jwk = JSON.parse(fs.readFileSync('../wallet.json', 'utf-8'))
 const jwk = JSON.parse(Buffer.from(process.env.COOKBOOK, 'base64').toString('utf-8'))

const bundlr = new Bundlr.default('https://node2.bundlr.network', 'arweave', jwk)
const warp = WarpFactory.custom(
  arweave,
  defaultCacheOptions,
  'mainnet'
).useArweaveGateway().build()

const contract = warp.contract(ANT).connect(jwk)
// upload folder
const result = await bundlr.uploadFolder('./src/.vuepress/dist', {
  indexFile: 'index.html'
})


// update ANT

await contract.writeInteraction({
  function: 'setRecord',
  subDomain: 'link',
  transactionId: result.id
})

console.log('Deployed Cookbook, please wait 20 - 30 minutes for ArNS to update!')
