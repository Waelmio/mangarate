# PostgreSQL -- DEV
You can use docker to run Postgres
```
sudo docker run -d \
	--name mangarate_dev_db \
	-e POSTGRES_DB=db_mangarate_dev \
    -e POSTGRES_USER=mangarate \
    -e POSTGRES_PASSWORD=password \
    -p 5433:5432 \
	postgres
```
And then
```
sudo docker run -d \
	--name mangarate_test_db \
	-e POSTGRES_DB=db_mangarate_test \
    -e POSTGRES_USER=mangarate \
    -e POSTGRES_PASSWORD=password \
    -p 5434:5432 \
	postgres
```

If they are stopped, you can run
```
sudo docker start mangarate_test_db
sudo docker start mangarate_dev_db
```

Voilà !