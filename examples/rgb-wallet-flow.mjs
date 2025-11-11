import axios from 'axios'
import WalletManagerRgb from '@tetherto/wdk-wallet-rgb'
import { createWallet } from 'rgb-sdk'

const RGB_MANAGER_ENDPOINT = process.env.RGB_NODE_ENDPOINT ?? 'http://127.0.0.1:8000'
const BITCOIN_NODE_ENDPOINT = process.env.BITCOIN_NODE_ENDPOINT ?? 'http://18.119.98.232:5000/execute'
const BITCOIN_NETWORK = process.env.BITCOIN_NETWORK ?? 'regtest'

async function rpcCall (command) {
  const response = await axios.post(BITCOIN_NODE_ENDPOINT, { args: command }, {
    headers: { 'Content-Type': 'application/json' }
  })
  return response.data?.result ?? response.data
}

export async function mine (numBlocks = 1) {
  await rpcCall(`mine ${numBlocks}`)
}

export async function sendToAddress (address, amountBtc) {
  return await rpcCall(`sendtoaddress ${address} ${amountBtc}`)
}

export async function initWallet ({ mnemonic } = {}) {
  const keys = mnemonic
    ? await createWallet(BITCOIN_NETWORK, mnemonic)
    : await createWallet(BITCOIN_NETWORK)
  console.log('Keys:', keys)

  const walletManager = new WalletManagerRgb(keys.mnemonic, {
    network: BITCOIN_NETWORK,
    rgb_node_endpoint: RGB_MANAGER_ENDPOINT
  })

  const account = await walletManager.getAccount()

  console.log('Wallet initialised for path:', account.path)

  const address = await account.getAddress()
  console.log('Address:', address)
  await sendToAddress(address, 0.01)
  await mine(3)
  // Wait for the transaction to be processed, otherwise the balance will be 0 until the next block is mined
  await new Promise(resolve => setTimeout(resolve, 21000))
  await account.syncWallet()
  const balance = await account.getBalance()
  console.log('Balance:', balance)

  console.log('KeyPair:', account.keyPair)

  return { account, keys }
}

export async function fullExample () {
  console.log('Starting RGB wallet example')
  console.log('='.repeat(60))
  const { account: testAccount, keys: testKeys } = await initWallet({ mnemonic: 'poem twice question inch happy capital grain quality laptop dry chaos what' })
  console.log('Test account:', testAccount)
  console.log('Test keys:', testKeys)
  console.log('Test address:', await testAccount.getAddress())
  console.log('Test balance:', await testAccount.getBalance())
  console.log('Test keyPair:', await testAccount.keyPair)
  console.log('Test path:', await testAccount.path)
  console.log('Test colored path:', await testAccount.coloredPath)
  console.log('Test index:', await testAccount.index)
  console.log('Test config:', await testAccount.config)
  const { account: senderAccount, keys } = await initWallet({})

  const senderUtxos = await senderAccount.createUtxos({ num: 5 })
  console.log('UTXOs:', senderUtxos)

  console.log('\nIssuing asset...')
  const asset = await senderAccount.issueAssetNia({
    ticker: 'DEMO',
    name: 'Demo Asset',
    amounts: [100, 50],
    precision: 0
  })
  console.log('Asset issued:', asset)

  const { account: receiverAccount } = await initWallet({})
  const receiverUtxos = await receiverAccount.createUtxos({ num: 5 })
  console.log('UTXOs:', receiverUtxos)
  console.log('\nCreating blind receive invoice...')
  const invoice = await receiverAccount.receiveAsset({
    amount: 10
  })
  console.log('Invoice:', invoice)

  console.log('\nSending asset...')
  const sendResult = await senderAccount.send({
    asset_id: asset.asset_id,
    amount: 10,
    invoice: invoice.invoice,
    min_confirmations: 1
  })
  console.log('Send result:', sendResult)
  await senderAccount.refreshWallet()
  await receiverAccount.refreshWallet()
  console.log('\nMining confirmations...')
  await mine(10)

  console.log('\nReceiver assets:')
  console.log(await receiverAccount.listAssets())

  const witnessInvoice = await receiverAccount.receiveAsset({
    asset_id: asset.asset_id,
    amount: 10,
    witness: true
  })
  console.log('Witness invoice:', witnessInvoice)

  const sendWitnessResult = await senderAccount.send({
    asset_id: asset.asset_id,
    amount: 10,
    invoice: witnessInvoice.invoice,
    witness_data: {
      amount_sat: 1000,
      blinding: null
    },
    min_confirmations: 1
  })
  console.log('Send witness result:', sendWitnessResult)
  await senderAccount.refreshWallet()
  await receiverAccount.refreshWallet()
  console.log('\nMining confirmations...')
  await mine(10)

  console.log('\nReceiver assets:')
  const rcvAssetBalance = await receiverAccount.listAssets()
  console.log(JSON.stringify(rcvAssetBalance, null, 2))

  console.log('\nReceiver transfers:')
  console.log(await receiverAccount.listTransfers(asset.asset_id))

  console.log('\nCreating encrypted backup for sender wallet...')
  const backupPassword = 'rgb-demo-password'
  const backupResponse = await senderAccount.createBackup(backupPassword)
  console.log('Backup response:', backupResponse)
  console.log('Backup download URL:', backupResponse?.download_url)

  const backupFile = await senderAccount.downloadBackup()
  console.log('Backup file size (bytes):', Buffer.from(backupFile).byteLength)

  console.log('\nRestoring wallet from backup...')
  const restoredManager = new WalletManagerRgb(keys.mnemonic, {
    network: BITCOIN_NETWORK,
    rgb_node_endpoint: RGB_MANAGER_ENDPOINT
  })

  const restoredAccount = await restoredManager.restoreAccountFromBackup({
    backup: backupFile,
    password: backupPassword,
    filename: 'rgb-demo-backup.rgb'
  })

  console.log('Restored account address:', await restoredAccount.getAddress())
  console.log('Restored account balance:', await restoredAccount.getBalance())

  console.log('\nExample complete!')
}

const isMain = import.meta.url === `file://${process.argv[1]}`
if (isMain) {
  fullExample()
    .then(() => {
      console.log('All operations completed successfully')
      process.exit(0)
    })
    .catch(err => {
      console.error('Example failed:', err)
      process.exit(1)
    })
}
