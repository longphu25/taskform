.PHONY: dev build lint format codegen contract-build contract-test contract-summary contract-publish

# === Frontend ===

dev:
	pnpm dev

build:
	pnpm build

lint:
	pnpm lint

format:
	pnpm format

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
	bun codegen
