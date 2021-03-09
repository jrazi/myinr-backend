FROM mcr.microsoft.com/mssql/server:2017-GA-ubuntu

COPY ./setup.sql /db/setup.sql
COPY ./setup_database.sh /db/setup_database.sh
COPY ./entrypoint.sh /db/entrypoint.sh

CMD /bin/bash /db/entrypoint.sh
