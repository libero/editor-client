.ONESHELL: # Only applies to all target

start_api:
	# docker-compose -f ../editor-article-store/docker-compose.yaml up -d localstack 
	$(shell cd ../editor-article-store; pwd)
	# cd ../editor-article-store
	# $(MAKE) -f $(shell pwd)/Makefile start_dev
	$(shell make start_dev)
	make start_dev