.PHONY: dev build lint format codegen contract-build contract-test contract-summary contract-publish

# === Frontend ===

dev:
	bun run dev

build:
	bun run build

lint:
	bun run lint

format:
	bun run format	

# === Contract ===

contract-build:
	$(MAKE) -C contract build

contract-test:
	$(MAKE) -C contract test

contract-summary:
	$(MAKE) -C contract summary

contract-publish:
	$(MAKE) -C contract publish

# === Codegen (requires contract-summary first) ===

codegen: contract-summary
	bunx sui-ts-codegen generate
	bun biome format --write src/contract/
