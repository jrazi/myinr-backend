CREATE DATABASE myinrir_test;
GO
CREATE LOGIN myinrir_test WITH PASSWORD = 'kyIg72@2'
GO
USE myinrir_test;
GO
IF NOT EXISTS (SELECT * FROM sys.database_principals WHERE name = N'myinrir_test')
BEGIN
    CREATE USER myinrir_test FOR LOGIN myinrir_test
    EXEC sp_addrolemember N'db_owner', N'myinrir_test'
END;
GO
QUIT
