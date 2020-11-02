.PHONY: start_api

start_api:
	$(MAKE) -C ../editor-article-store start
	cd ../editor-article-store
	docker exec localstack awslocal s3 cp /resources/articles/elife-54296-vor-r1.zip s3://kryia/

start_nginx:
	docker-compose up -d nginx

start_all: start_api start_nginx
	npm run start