#!/use/bin/make -f
.PHONY: lint test clean distclean build start container all

.DEFAULT_GOAL := start

TAG ?= latest

lint:
	@npm run lint

test:
	@npm run test

clean:
	@npm run clean

distclean:
	@npm run distclean

build: node_modules
	@npm run build

start: node_modules
	@npm run start

dist: build
	@docker build -t liberoadmin/editor-client:$(TAG) .

# Project specific targets
node_modules:
	@npm run install