#!/usr/bin/env bash
# Wait for database to startup
sleep 80
/opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P "1Secure*Password1" -i /db/setup.sql
