#!/use/bin/make -f
.PHONY: lint test clean distclean build start container all

.DEFAULT_GOAL := start

TAG ?= latest

lint:
	@npm run lint

test:
	@npm run test

clean:
	-@rm -rf $(CURDIR)/build $(CURDIR)/coverage

distclean: clean
	-@rm -rf $(CURDIR)/node_modules

build: node_modules
	@npm run build

start: node_modules
	@npm run start

dist: build
	@docker build -t liberoadmin/editor-client:$(TAG) .

# Project specific targets
node_modules:
	npm install