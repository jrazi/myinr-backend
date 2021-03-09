#!/usr/bin/env bash
set -m
ls
ls /db
ls /
/opt/mssql/bin/sqlservr & /db/setup_database.sh
fg