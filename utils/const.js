import { clusterApiUrl, PublicKey } from '@solana/web3.js'
import spotify from './spotify.json'

// export const SOLANA_HOST = "https://localhost:8899"
export const SOLANA_HOST = "https://distinguished-cold-arrow.solana-devnet.quiknode.pro/4234ee1b7b55cdbe011e3ae5ab4fb21c4c139bc4"

export const STABLE_POOL_PROGRAM_ID = new PublicKey(
  'HvFiRFSrpRCP77kzQ7u37BGNsmGcBs3Ayp21ZgiXQkdN',
)

export const STABLE_POOL_IDL = spotify
