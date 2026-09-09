# Presentations Makefile
#
# Targets that accept DECK and PORT: dev, build, export, routes, lint
# Targets that accept DECK only:     (none currently)
# Targets with no variables:         install, stop, status, log, clean

SHELL := /bin/bash
ROOT := $(dir $(abspath $(lastword $(MAKEFILE_LIST))))
SLIDEV := pnpm exec slidev
PORT ?= 3030
DECK ?= rekindle-transport-veilid
PIDFILE := $(ROOT).slidev-dev.pid
LOGFILE := $(ROOT).slidev-dev.log

.PHONY: install dev stop status log build export clean routes lint lint-fix lint-slides test typecheck

install:
	pnpm install -C $(ROOT)

dev: install stop
	cd $(ROOT)decks/$(DECK) && $(SLIDEV) --port $(PORT) 2>&1 | tee $(LOGFILE) &
	@echo $$! > $(PIDFILE)
	@echo "waiting for http://localhost:$(PORT) ..."
	@for i in $$(seq 1 60); do \
		curl -sf http://localhost:$(PORT) > /dev/null 2>&1 && break; \
		sleep 1; \
	done
	@curl -sf http://localhost:$(PORT) > /dev/null 2>&1 \
		&& echo "dev server ready on http://localhost:$(PORT)" \
		|| (echo "ERROR: dev server did not start within 60s"; exit 1)

stop:
	@if [ -f $(PIDFILE) ]; then \
		kill $$(cat $(PIDFILE)) 2>/dev/null || true; \
		rm -f $(PIDFILE); \
		echo "dev server stopped"; \
	else \
		echo "no pidfile found; killing any slidev on port $(PORT)"; \
		lsof -ti:$(PORT) | xargs kill 2>/dev/null || true; \
	fi

status:
	@if [ -f $(PIDFILE) ] && kill -0 $$(cat $(PIDFILE)) 2>/dev/null; then \
		echo "dev server running (pid $$(cat $(PIDFILE)))"; \
	else \
		echo "dev server not running"; \
	fi

log:
	@if [ -f $(LOGFILE) ]; then \
		tail -f $(LOGFILE); \
	else \
		echo "no log file found; run 'make dev' first"; \
	fi

build: install
	cd $(ROOT)decks/$(DECK) && $(SLIDEV) build --out $(ROOT)dist/$(DECK)

export: install
	cd $(ROOT)decks/$(DECK) && $(SLIDEV) export --output $(ROOT)dist/$(DECK).pdf

clean:
	rm -rf $(ROOT)dist $(PIDFILE) $(LOGFILE)

test: install
	pnpm -C $(ROOT) test

typecheck: install
	pnpm -C $(ROOT) exec vue-tsc --noEmit

lint: install
	pnpm -C $(ROOT) lint

lint-fix: install
	pnpm -C $(ROOT) exec eslint --fix .

lint-slides:
	DECK=$(DECK) PORT=$(PORT) $(ROOT)scripts/lint-overflow.sh

routes:
	@grep -h 'routeAlias:' $(ROOT)decks/$(DECK)/slides.md | sed 's/.*routeAlias: *//' | while read alias; do \
		echo "  http://localhost:$(PORT)/$$alias"; \
	done
