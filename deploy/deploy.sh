#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
CONTAINER_NAME="walrus-site-deploy"
IMAGE_NAME="walrus-site-builder"

echo "🔨 Building deploy image..."
docker build -t "$IMAGE_NAME" "$SCRIPT_DIR"

echo ""
echo "📦 Building site for Walrus..."
cd "$PROJECT_DIR"
bun run build:walrus

echo ""
echo "🚀 Starting deploy container (auto-remove on stop)..."
docker run --rm -d \
  --name "$CONTAINER_NAME" \
  --platform linux/amd64 \
  -p 2222:22 \
  -v "$PROJECT_DIR/dist:/site:ro" \
  "$IMAGE_NAME"

echo ""
echo "============================================"
echo "  Container đang chạy!"
echo "============================================"
echo ""
echo "  SSH vào:  ssh root@localhost -p 2222"
echo "  Password: deploy"
echo ""
echo "  Sau khi deploy xong, dừng container:"
echo "    docker stop $CONTAINER_NAME"
echo ""
echo "  Container sẽ tự xóa (--rm), private key biến mất."
echo "============================================"
