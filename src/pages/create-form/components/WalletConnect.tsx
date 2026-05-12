import { useEffect, useState, useCallback } from 'react'
import { Wallet, LogOut, ChevronDown } from 'lucide-react'

interface WalletInfo {
  address: string
  name: string
}

interface DetectedWallet {
  name: string
  icon?: string
}

export function WalletConnect() {
  const [wallet, setWallet] = useState<WalletInfo | null>(null)
  const [wallets, setWallets] = useState<DetectedWallet[]>([])
  const [showMenu, setShowMenu] = useState(false)
  const [connecting, setConnecting] = useState(false)

  useEffect(() => {
    import('../../../lazy/sui-client').then(({ dAppKit }) => {
      // Get detected wallets
      const detected = dAppKit.stores.$wallets.get()
      setWallets(detected.map((w: { name: string }) => ({ name: w.name })))

      // Check if already connected
      const connection = dAppKit.stores.$connection.get()
      if (connection.isConnected && connection.account) {
        setWallet({
          address: connection.account.address,
          name: connection.wallet?.name ?? 'Wallet',
        })
      }

      // Subscribe to connection changes
      const unsub = dAppKit.stores.$connection.subscribe(
        (conn: {
          isConnected: boolean
          account: { address: string } | null
          wallet: { name: string } | null
        }) => {
          if (conn.isConnected && conn.account) {
            setWallet({ address: conn.account.address, name: conn.wallet?.name ?? 'Wallet' })
          } else {
            setWallet(null)
          }
        },
      )

      return unsub
    })
  }, [])

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
          <div className="absolute right-0 top-full mt-1 z-50 rounded-lg border border-white/10 bg-zinc-900 p-1 shadow-xl">
            <button
              type="button"
              onClick={disconnect}
              className="flex w-full items-center gap-2 cursor-pointer rounded-md px-3 py-2 text-sm text-red-400 hover:bg-red-500/10"
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
