.PHONY: build start stop logs ssh-app create-db

build:
	docker-compose build
start:
	docker-compose up -d
stop:
	docker stop cpos-management-basecode-app
	docker stop cpos-management-basecode-mongodb
logs:
	docker logs -f cpos-management-basecode-app
ssh-app:
	docker exec -it cpos-management-basecode-app bash
create-db:
	docker exec -it cpos-management-mongodb mongo basecode /setup/mongo-init.js