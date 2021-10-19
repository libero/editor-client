.DEFAULT_GOAL := help
.PHONY: start_api start_nginx start_all help

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

start_api: ## Start editor-article-store in dev mode with supporting services
	$(MAKE) -C ../editor-article-store setup
	$(MAKE) -C ../editor-article-store LOGGING=false start_dev
	cd ../editor-article-store
	docker exec localstack awslocal s3 cp /resources/articles/elife-54296-vor-r1.zip s3://kryia/
	sleep 5

start_nginx: ## Start nginx proxy service
	docker-compose up -d nginx

start_all: start_api start_nginx ## Start editor-client and editor-article-store in dev mode
	npm run start:localstack