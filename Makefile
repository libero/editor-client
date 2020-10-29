.PHONY: start_api

start_api:
	$(MAKE) -C ../editor-article-store start

start_nginx:
	docker-compose up -d nginx

start_all: start_api start_nginx
	npm run start