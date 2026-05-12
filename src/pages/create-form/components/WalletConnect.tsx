import { useEffect, useState, useCallback } from 'react'
import { Wallet, LogOut, ChevronDown, Coins } from 'lucide-react'

interface WalletInfo {
  address: string
  name: string
}

interface DetectedWallet {
  name: string
}

interface CoinBalance {
  sui: string
  wal: string
}

// WAL coin type on testnet (from Walrus exchange)
const WAL_COIN_TYPE_TESTNET =
  '0x8190b041122eb492bf63cb464476bd68c6b7e570540218c80a68bca413e3ed84::wal::WAL'

export function WalletConnect() {
  const [wallet, setWallet] = useState<WalletInfo | null>(null)
  const [wallets, setWallets] = useState<DetectedWallet[]>([])
  const [showMenu, setShowMenu] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [balances, setBalances] = useState<CoinBalance | null>(null)

  const fetchBalances = useCallback(async (address: string) => {
    try {
      const { getSuiClient } = await import('../../../lazy/sui-client')
      const client = getSuiClient()

      // Fetch SUI balance
      const suiBalance = await client.core.getBalance({ owner: address })
      const suiAmount = (Number(suiBalance.balance?.balance ?? 0n) / 1_000_000_000).toFixed(2)

      // Fetch WAL balance
      let walAmount = '0.00'
      try {
        const walBalance = await client.core.getBalance({
          owner: address,
          coinType: WAL_COIN_TYPE_TESTNET,
        })
        walAmount = (Number(walBalance.balance?.balance ?? 0n) / 1_000_000_000).toFixed(2)
      } catch {
        // WAL might not exist in wallet
      }

      setBalances({ sui: suiAmount, wal: walAmount })
    } catch (err) {
      console.error('Failed to fetch balances:', err)
    }
  }, [])

  useEffect(() => {
    import('../../../lazy/sui-client').then(({ dAppKit }) => {
      const detected = dAppKit.stores.$wallets.get()
      setWallets(detected.map((w: { name: string }) => ({ name: w.name })))

      const connection = dAppKit.stores.$connection.get()
      if (connection.isConnected && connection.account) {
        setWallet({
          address: connection.account.address,
          name: connection.wallet?.name ?? 'Wallet',
        })
        fetchBalances(connection.account.address)
      }

      dAppKit.stores.$connection.subscribe(
        (conn: {
          isConnected: boolean
          account: { address: string } | null
          wallet: { name: string } | null
        }) => {
          if (conn.isConnected && conn.account) {
            setWallet({ address: conn.account.address, name: conn.wallet?.name ?? 'Wallet' })
            fetchBalances(conn.account.address)
          } else {
            setWallet(null)
            setBalances(null)
          }
        },
      )
    })
  }, [fetchBalances])

  const connect = useCallback(async (walletName?: string) => {
    setConnecting(true)
    try {
      const { dAppKit } = await import('../../../lazy/sui-client')
      const available = dAppKit.stores.$wallets.get()
      const target = walletName
        ? available.find((w: { name: string }) => w.name === walletName)
        : available[0]

      if (!target) {
        alert('No Sui wallet detected. Please install Slush, Sui Wallet, or Suiet.')
        setConnecting(false)
        return
      }

      await dAppKit.connectWallet({ wallet: target })
    } catch (err) {
      console.error('Wallet connect failed:', err)
    } finally {
      setConnecting(false)
      setShowMenu(false)
    }
  }, [])

  const disconnect = useCallback(async () => {
    const { dAppKit } = await import('../../../lazy/sui-client')
    await dAppKit.disconnectWallet()
    setShowMenu(false)
  }, [])

  if (wallet) {
    const short = `${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}`
    return (
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowMenu(!showMenu)}
          className="flex items-center gap-2 cursor-pointer rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-sm text-emerald-400 transition-colors hover:bg-emerald-500/20"
        >
          <Wallet className="size-3.5" />
          <span className="font-mono text-xs">{short}</span>
          <ChevronDown className="size-3" />
        </button>

        {showMenu && (
          <div className="absolute right-0 top-full mt-1 z-50 min-w-[200px] rounded-lg border border-white/10 bg-zinc-900 p-2 shadow-xl">
            {/* Wallet name */}
            <div className="px-2 py-1 mb-2 border-b border-white/10">
              <p className="text-xs text-zinc-400">{wallet.name}</p>
              <p className="font-mono text-xs text-zinc-300">{short}</p>
            </div>

            {/* Balances */}
            {balances && (
              <div className="px-2 py-2 mb-2 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs text-zinc-400">
                    <Coins className="size-3" />
                    SUI
                  </span>
                  <span className="font-mono text-xs text-white">{balances.sui}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs text-zinc-400">
                    <Coins className="size-3" />
                    WAL
                  </span>
                  <span
                    className={`font-mono text-xs ${Number(balances.wal) > 0 ? 'text-white' : 'text-red-400'}`}
                  >
                    {balances.wal}
                  </span>
                </div>
                {Number(balances.wal) === 0 && (
                  <p className="text-[10px] text-amber-400 mt-1">
                    Need WAL to upload. Get from{' '}
                    <a
                      href="https://faucet.walrus.site"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-amber-300"
                    >
                      Walrus Faucet
                    </a>
                  </p>
                )}
              </div>
            )}

            {/* Disconnect */}
            <button
              type="button"
              onClick={disconnect}
              className="flex w-full items-center gap-2 cursor-pointer rounded-md px-2 py-1.5 text-sm text-red-400 hover:bg-red-500/10"
            >
              <LogOut className="size-3.5" />
              Disconnect
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => (wallets.length > 1 ? setShowMenu(!showMenu) : connect())}
        disabled={connecting}
        className="flex items-center gap-2 cursor-pointer rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5 text-sm text-indigo-400 transition-colors hover:bg-indigo-500/20 disabled:opacity-50"
      >
        <Wallet className="size-3.5" />
        {connecting ? 'Connecting...' : 'Connect Wallet'}
      </button>

      {showMenu && wallets.length > 1 && (
        <div className="absolute right-0 top-full mt-1 z-50 rounded-lg border border-white/10 bg-zinc-900 p-1 shadow-xl min-w-[160px]">
          {wallets.map((w) => (
            <button
              key={w.name}
              type="button"
              onClick={() => connect(w.name)}
              className="flex w-full items-center gap-2 cursor-pointer rounded-md px-3 py-2 text-sm text-zinc-300 hover:bg-white/5"
            >
              {w.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/**
 * Hook to get the connected wallet address.
 * Returns null if not connected.
 */
export function useWalletAddress(): string | null {
  const [address, setAddress] = useState<string | null>(null)

  useEffect(() => {
    import('../../../lazy/sui-client').then(({ dAppKit }) => {
      const connection = dAppKit.stores.$connection.get()
      if (connection.isConnected && connection.account) {
        setAddress(connection.account.address)
      }

      dAppKit.stores.$connection.subscribe(
        (conn: { isConnected: boolean; account: { address: string } | null }) => {
          if (conn.isConnected && conn.account) {
            setAddress(conn.account.address)
          } else {
            setAddress(null)
          }
        },
      )
    })
  }, [])

  return address
}
