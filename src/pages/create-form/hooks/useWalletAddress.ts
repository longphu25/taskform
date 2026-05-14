import { useEffect, useState } from 'react'

/**
 * Hook to get the connected wallet address.
 * Returns null if not connected.
 */
export function useWalletAddress(): string | null {
  const [address, setAddress] = useState<string | null>(null)

  useEffect(() => {
    let unsubscribe: (() => void) | undefined
    import('../../../lazy/sui-client').then(({ dAppKit }) => {
      const connection = dAppKit.stores.$connection.get()
      if (connection.isConnected && connection.account) {
        setAddress(connection.account.address)
      }

      unsubscribe = dAppKit.stores.$connection.subscribe(
        (conn: { isConnected: boolean; account: { address: string } | null }) => {
          if (conn.isConnected && conn.account) {
            setAddress(conn.account.address)
          } else {
            setAddress(null)
          }
        },
      )
    })
    return () => {
      unsubscribe?.()
    }
  }, [])

  return address
}
