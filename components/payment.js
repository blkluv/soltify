import { useEffect, useState } from 'react'
import { getProgramInstance } from '../utils/utils'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { SOLANA_HOST } from '../utils/const'
import { PublicKey } from '@solana/web3.js'
import { useWallet } from '@solana/wallet-adapter-react'
import HomePage from '../pages/homepage'

const anchor = require('@project-serum/anchor')

const { web3 } = anchor
const { SystemProgram } = web3
const utf8 = anchor.utils.bytes.utf8

const defaultAccounts = {
  tokenProgram: TOKEN_PROGRAM_ID,
  clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
  systemProgram: SystemProgram.programId,
}

export const Payment = () => {
  const wallet = useWallet()
  const connection = new anchor.web3.Connection(SOLANA_HOST)
  const program = getProgramInstance(connection, wallet)
  const [payers, setPayers] = useState([])
  const [isPaid, setPaid] = useState(false)

  useEffect(() => {
    if (wallet.connected) {
      getAllWallets()
      console.log("Wallet connected")
      // console.log(wallet)
    } else {
      console.log("Wallet not connected.")
    }
  }, [wallet.connected, isPaid])

  const getAllWallets = async () => {
    const payerList = await program.account.payerAccount.all()
    setPayers(payerList)

    payerList.forEach(payer => {
      if (payer.account.wallet.toBase58() == wallet.publicKey.toBase58())
        setPaid(true)
    })
  }

  const payClicked = async () => {
    let [payerSigner, bump] = anchor.web3.PublicKey.findProgramAddressSync(
      [utf8.encode("payer"), wallet.publicKey.toBuffer()],
      program.programId
    )
    // payerSigner+=bump

    let payerInfo
    try {

      payerInfo = await program.account.payerAccount.fetch(payerSigner)
      console.log("c")
    } catch (e) {
      console.log(e)
      try {
        console.log("b")
        console.log(wallet.publicKey.toBase58())
        console.log(payerSigner.toBase58())
        await program.rpc.acceptPayment({
          accounts: {
            payerWallet: payerSigner,
            receiver: new PublicKey(
              'ANh76nb4KVU54fLVyGjaj6atvS3mASDcRTjaEPiSKwqD',
            ),
            authority: wallet.publicKey,
            ...defaultAccounts,
          },
        })
        alert('Transaction successful!')
      } catch (e) {
        console.log(e)
        alert(e.message)
      }
    }
  }

  /** show homepage if user makes payment */
  if (isPaid) return <HomePage />

  /** Payment Component */
  return (
    <div className={styles.main}>
      <p className={styles.text}>Make payment</p>
      <div className={styles.buttons}>
        <button
          className={styles.button}
          onClick={payClicked}
          disabled={isPaid}
        >
          Pay 0.1 Sol
        </button>
        <button className={styles.button} onClick={getAllWallets}>
          Update List
        </button>
      </div>
    </div>
  )
}

const styles = {
  main: `w-screen h-screen bg-white text-black flex flex-col justify-center items-center`,
  button: `bg-[#22C55E] m-3 text-white font-bold py-4 px-7 rounded-full hover:opacity-70 transition`,
  text: `text-4xl text-black mb-10`,
  buttons: `flex items-center`,
}
