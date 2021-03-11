#!/usr/bin/env bash
set -m
/opt/mssql/bin/sqlservr & /db/setup_database.sh
fg