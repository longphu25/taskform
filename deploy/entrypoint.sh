#!/bin/bash
set -e

echo "============================================"
echo "  Walrus Site Deploy Container (mainnet)"
echo "============================================"
echo ""
echo "SSH vào container:"
echo "  ssh root@localhost -p 2222"
echo "  Password: deploy"
echo ""
echo "Sau khi SSH vào, chạy:"
echo "  1. Import private key:"
echo "     sui client new-env --alias mainnet --rpc https://fullnode.mainnet.sui.io:443"
echo "     sui client switch --env mainnet"
echo "     sui keytool import <YOUR_PRIVATE_KEY> ed25519"
echo "     sui client switch --address <YOUR_ADDRESS>"
echo ""
echo "  2. Verify:"
echo "     sui client active-address"
echo "     sui client balance"
echo ""
echo "  3. Deploy site:"
echo "     site-builder deploy --epochs 100 /site"
echo ""
echo "  4. Khi xong, exit SSH và container sẽ tự xóa."
echo "============================================"
echo ""

# Start SSH daemon in foreground
exec /usr/sbin/sshd -D
