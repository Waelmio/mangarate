# PostgreSQL -- DEV
First thing first, install postgresql and change your admin password:
```
sudo apt install postgresql
sudo -u postgres psql
\password
\q
```

Create a user `mangaratedev`, and two databases, `db_mangarate_test`, `db_mangarate_dev`:
```
sudo -u postgres createuser mangaratedev;
sudo -u postgres psql
```
And then
```
ALTER USER mangaratedev WITH PASSWORD 'password';
CREATE DATABASE db_mangarate_test;
\connect db_mangarate_test
DROP SCHEMA PUBLIC CASCADE;
CREATE SCHEMA IF NOT EXISTS my_scheme AUTHORIZATION mangaratedev;
ALTER DATABASE db_mangarate_test SET search_path TO my_scheme;
CREATE DATABASE db_mangarate_dev;
\connect db_mangarate_dev
DROP SCHEMA PUBLIC CASCADE;
CREATE SCHEMA IF NOT EXISTS my_scheme AUTHORIZATION mangaratedev;
ALTER DATABASE db_mangarate_dev SET search_path TO my_scheme;
\q
```

Now, change your postgresql config so that login will work correctly:
If you have postgres v12:
```
sudo sed -i -e "s/local.*all.*\(postgres\|all\).*peer/local   all             \1                                md5/g" /etc/postgresql/12/main/pg_hba.conf
sudo service postgresql restart
```

Voilà !