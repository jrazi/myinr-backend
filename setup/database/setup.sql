PRINT 'Executing DB creation script.'
USE [master]
GO
IF EXISTS (SELECT * FROM sys.databases WHERE name = 'myinrir_test')
BEGIN
	PRINT 'Database already exists. Skipping script execution.'
	SET NOEXEC ON
END
GO
CREATE DATABASE [myinrir_test]
GO
CREATE LOGIN myinrir_test WITH PASSWORD = '11__*password*__11'
GO
ALTER DATABASE [myinrir_test] SET COMPATIBILITY_LEVEL = 110
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [myinrir_test].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [myinrir_test] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [myinrir_test] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [myinrir_test] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [myinrir_test] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [myinrir_test] SET ARITHABORT OFF 
GO
ALTER DATABASE [myinrir_test] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [myinrir_test] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [myinrir_test] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [myinrir_test] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [myinrir_test] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [myinrir_test] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [myinrir_test] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [myinrir_test] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [myinrir_test] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [myinrir_test] SET  ENABLE_BROKER 
GO
ALTER DATABASE [myinrir_test] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [myinrir_test] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [myinrir_test] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [myinrir_test] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [myinrir_test] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [myinrir_test] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [myinrir_test] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [myinrir_test] SET RECOVERY FULL 
GO
ALTER DATABASE [myinrir_test] SET  MULTI_USER 
GO
ALTER DATABASE [myinrir_test] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [myinrir_test] SET DB_CHAINING OFF 
GO
ALTER DATABASE [myinrir_test] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [myinrir_test] SET TARGET_RECOVERY_TIME = 0 SECONDS 
GO
EXEC sys.sp_db_vardecimal_storage_format N'myinrir_test', N'ON'
GO
USE [myinrir_test]
GO
CREATE USER [myinrir_test] FOR LOGIN [myinrir_test]
EXEC sp_addrolemember N'db_owner', N'myinrir_test'
GO
CREATE SCHEMA [myinrir_test]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AdminTbl](
	[IDAdmin] [int] IDENTITY(1,1) NOT NULL,
	[FNameAdmin] [nvarchar](100) NOT NULL,
	[NIDAdmin] [nvarchar](100) NOT NULL,
	[PhoneAdmin] [nvarchar](100) NOT NULL,
	[EmailAdmin] [nvarchar](100) NOT NULL,
	[IDUserAdmin] [int] NOT NULL,
	[LNameAdmin] [nvarchar](100) NOT NULL,
 CONSTRAINT [PK_AdminTbl] PRIMARY KEY CLUSTERED 
(
	[IDAdmin] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[AnsectorTbl]    Script Date: 5/21/2021 6:28:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AnsectorTbl](
	[IDAnsector] [int] IDENTITY(1,1) NOT NULL,
	[NameAnsector] [nvarchar](100) NOT NULL,
	[StatusAncestor] [int] NULL,
 CONSTRAINT [PK_AnsectorTbl] PRIMARY KEY CLUSTERED 
(
	[IDAnsector] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[event]    Script Date: 5/21/2021 6:28:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[event](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[name] [varchar](50) NULL,
	[eventstart] [datetime] NOT NULL,
	[eventend] [datetime] NOT NULL,
	[resource] [varchar](10) NULL,
 CONSTRAINT [PK_event] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[flagTbl]    Script Date: 5/21/2021 6:28:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[flagTbl](
	[IDFlag] [int] IDENTITY(1,1) NOT NULL,
	[IDPatientFlag] [int] NOT NULL,
	[IDPhysicianFlag] [int] NOT NULL,
	[PhTOPtFlag] [int] NOT NULL,
	[PtToPhFlag] [int] NOT NULL,
 CONSTRAINT [PK_flagTbl] PRIMARY KEY CLUSTERED 
(
	[IDFlag] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PatientTbl]    Script Date: 5/21/2021 6:28:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PatientTbl](
	[IDPatient] [int] IDENTITY(1,1) NOT NULL,
	[FNamePatient] [nvarchar](100) NOT NULL,
	[NIDPatient] [nvarchar](50) NOT NULL,
	[PhonePatient] [nvarchar](50) NULL,
	[IDPhysicianPatient] [int] NOT NULL,
	[BirthDatePatient] [nvarchar](50) NULL,
	[PrescriptionPatient] [nvarchar](100) NULL,
	[EmailPatient] [varchar](100) NULL,
	[IDUserPatient] [int] NOT NULL,
	[LNamePatient] [nvarchar](100) NOT NULL,
	[Gender] [nvarchar](1) NULL,
	[FatherName] [nvarchar](100) NULL,
	[BirthPlace] [nvarchar](50) NULL,
	[Address] [ntext] NULL,
	[Mobile] [nvarchar](50) NULL,
	[EssentialPhone] [nvarchar](50) NULL,
	[IDSecretaryPatient] [int] NULL,
	[CausePatient] [nvarchar](100) NULL,
 CONSTRAINT [PK_PatientTbl] PRIMARY KEY CLUSTERED 
(
	[IDPatient] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PhAnTbl]    Script Date: 5/21/2021 6:28:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PhAnTbl](
	[IDPhAn] [int] IDENTITY(1,1) NOT NULL,
	[IDUserPhAn] [int] NOT NULL,
	[IDAncestorPhAn] [int] NOT NULL,
 CONSTRAINT [PK_PhAnTbl] PRIMARY KEY CLUSTERED 
(
	[IDPhAn] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PhysicianTbl]    Script Date: 5/21/2021 6:28:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PhysicianTbl](
	[IDPhysician] [int] IDENTITY(1,1) NOT NULL,
	[FNamePhysician] [nvarchar](100) NOT NULL,
	[LNamePhysician] [nvarchar](100) NULL,
	[NIDPhysician] [nvarchar](50) NOT NULL,
	[MedicalIDPhysician] [nvarchar](50) NOT NULL,
	[PhonePhysician] [nvarchar](50) NOT NULL,
	[EmailPhysician] [nvarchar](50) NOT NULL,
	[AddressPhysician] [nvarchar](200) NULL,
	[IDUserPhysician] [int] NOT NULL,
	[ExpertisePhysician] [nvarchar](100) NULL,
	[GotoSecretary] [int] NULL,
 CONSTRAINT [PK__Physicia__3976C6FFEB8E701A] PRIMARY KEY CLUSTERED 
(
	[IDPhysician] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PtToPyTbl]    Script Date: 5/21/2021 6:28:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PtToPyTbl](
	[IDPtToPy] [int] IDENTITY(1,1) NOT NULL,
	[IDPatientPtToPy] [int] NOT NULL,
	[IDPhysicianPtToPy] [int] NOT NULL,
	[INRPtToPy] [float] NULL,
	[CommentPtToPy] [ntext] NULL,
	[INRYearPtToPy] [nvarchar](4) NOT NULL,
	[INRMonthPtToPy] [nvarchar](2) NOT NULL,
	[INRDayPtToPy] [nvarchar](2) NOT NULL,
	[INRHourPtToPy] [nvarchar](2) NOT NULL,
	[INRMinutePtToPy] [nvarchar](2) NOT NULL,
	[YearPtToPy] [nvarchar](4) NOT NULL,
	[MonthPtToPy] [nvarchar](2) NOT NULL,
	[DayPtToPy] [nvarchar](2) NOT NULL,
	[HourPtToPy] [nvarchar](2) NOT NULL,
	[MinutePtToPy] [nvarchar](2) NOT NULL,
	[Lab] [nvarchar](255) NULL,
	[PortableDevice] [nvarchar](1) NULL,
	[BloodPressure] [nvarchar](10) NULL,
	[PulseRate] [nvarchar](10) NULL,
	[ChangeDosageDate] [nvarchar](10) NULL,
	[HighINR] [nvarchar](10) NULL,
	[LowINR] [nvarchar](10) NULL,
	[BleedingorClotting] [nvarchar](50) NULL,
 CONSTRAINT [PK_PtToPyTbl] PRIMARY KEY CLUSTERED 
(
	[IDPtToPy] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PyToPtTbl]    Script Date: 5/21/2021 6:28:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PyToPtTbl](
	[IDPyToPt] [int] IDENTITY(1,1) NOT NULL,
	[IDPatientPyToPt] [int] NULL,
	[IDPhysicianPyToPt] [int] NULL,
	[YearPyToPt] [nvarchar](4) NULL,
	[MonthPyToPt] [nvarchar](2) NULL,
	[DayPyToPt] [nvarchar](2) NULL,
	[HourPyToPt] [nvarchar](2) NULL,
	[MinutePyToPt] [nvarchar](2) NULL,
	[Instructions] [nvarchar](50) NULL,
	[Stopusingwarfarin] [nvarchar](5) NULL,
	[NextINRCheck] [nvarchar](10) NULL,
	[Comment] [ntext] NULL,
	[YearVisit] [nvarchar](4) NULL,
	[MonthVisit] [nvarchar](2) NULL,
	[DayVisit] [nvarchar](2) NULL,
	[FlagVisit] [nvarchar](1) NULL,
 CONSTRAINT [PK_PyToPtTbl] PRIMARY KEY CLUSTERED 
(
	[IDPyToPt] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[SecretaryTbl]    Script Date: 5/21/2021 6:28:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[SecretaryTbl](
	[IDSecretary] [int] IDENTITY(1,1) NOT NULL,
	[FNameSecretary] [nvarchar](100) NOT NULL,
	[NIDSecretary] [nvarchar](50) NOT NULL,
	[PhoneSecretary] [nvarchar](50) NOT NULL,
	[EmailSecretary] [nvarchar](100) NOT NULL,
	[IDUserSecretary] [int] NOT NULL,
	[LNameSecretary] [nvarchar](100) NULL,
 CONSTRAINT [PK__Secretar__AA161EF60AD2A005] PRIMARY KEY CLUSTERED 
(
	[IDSecretary] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[UserTbl]    Script Date: 5/21/2021 6:28:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[UserTbl](
	[IDUser] [int] IDENTITY(1,1) NOT NULL,
	[RoleUser] [int] NOT NULL,
	[UsernameUser] [nvarchar](100) NOT NULL,
	[PasswordUser] [nvarchar](100) NOT NULL,
	[StatusUser] [int] NULL,
 CONSTRAINT [PK_UserTbl] PRIMARY KEY CLUSTERED 
(
	[IDUser] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [myinrir_test].[AppointmentTbl]    Script Date: 5/21/2021 6:28:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [myinrir_test].[AppointmentTbl](
	[IDVisit] [int] IDENTITY(1,1) NOT NULL,
	[UserIDPatient] [int] NOT NULL,
	[AYearVisit] [nvarchar](4) NOT NULL,
	[AMonthVisit] [nvarchar](2) NOT NULL,
	[ADayVisit] [nvarchar](2) NOT NULL,
	[YearVisit] [nvarchar](4) NULL,
	[MonthVisit] [nvarchar](2) NULL,
	[DayVisit] [nvarchar](2) NULL,
	[HourVisit] [nvarchar](2) NULL,
	[MinuteVisit] [nvarchar](2) NULL,
	[FlagVisit] [nvarchar](1) NULL,
 CONSTRAINT [PK_appointmentTbl] PRIMARY KEY CLUSTERED 
(
	[IDVisit] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [myinrir_test].[CHADS-VAScTbl]    Script Date: 5/21/2021 6:28:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [myinrir_test].[CHADS-VAScTbl](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[PatientID] [int] NOT NULL,
	[Age] [int] NULL,
	[Sex] [int] NULL,
	[HeartFailure] [int] NULL,
	[Hypertension] [int] NULL,
	[Stroke] [int] NULL,
	[Vascular] [int] NULL,
	[Diabetes] [int] NULL,
 CONSTRAINT [PK_CHADS-VAScTbl] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [myinrir_test].[DosageTbl]    Script Date: 5/21/2021 6:28:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [myinrir_test].[DosageTbl](
	[IDDosage] [int] IDENTITY(1,1) NOT NULL,
	[IDUserPatient] [int] NULL,
	[PHDosage] [float] NULL,
	[PADosage] [float] NULL,
	[DayDosage] [nvarchar](2) NULL,
	[MonthDosage] [nvarchar](2) NULL,
	[YearDosage] [nvarchar](4) NULL,
 CONSTRAINT [PK_DosageTbl] PRIMARY KEY CLUSTERED 
(
	[IDDosage] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [myinrir_test].[DrugTbl]    Script Date: 5/21/2021 6:28:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [myinrir_test].[DrugTbl](
	[IDDrug] [int] IDENTITY(1,1) NOT NULL,
	[DrugName] [nvarchar](300) NULL,
	[Salt] [ntext] NULL,
	[DosageForm] [ntext] NULL,
	[Strengh] [nvarchar](100) NULL,
	[RouteofAdmin] [ntext] NULL,
	[ATCCode] [ntext] NULL,
	[Ingredient] [ntext] NULL,
	[Approvedclinicalindications] [ntext] NULL,
	[Accesslevel] [ntext] NULL,
	[Remarks] [ntext] NULL,
 CONSTRAINT [PK_DrugTbl] PRIMARY KEY CLUSTERED 
(
	[IDDrug] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [myinrir_test].[FirstDosageTbl]    Script Date: 5/21/2021 6:28:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [myinrir_test].[FirstDosageTbl](
	[IDDosage] [int] IDENTITY(1,1) NOT NULL,
	[IDUserPatient] [int] NULL,
	[Saturday] [nvarchar](10) NULL,
	[Sunday] [nvarchar](10) NULL,
	[Monday] [nvarchar](10) NULL,
	[Tuesday] [nvarchar](10) NULL,
	[Wednesday] [nvarchar](10) NULL,
	[Thursday] [nvarchar](10) NULL,
	[Friday] [nvarchar](10) NULL,
 CONSTRAINT [PK_FirstDosageTbl] PRIMARY KEY CLUSTERED 
(
	[IDDosage] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [myinrir_test].[FirstTbl]    Script Date: 5/21/2021 6:28:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [myinrir_test].[FirstTbl](
	[IDFirst] [int] IDENTITY(1,1) NOT NULL,
	[ReasonforusingWarfarin] [nvarchar](50) NULL,
	[dateofdiagnosis] [nvarchar](10) NULL,
	[dateoffirstWarfarin] [nvarchar](10) NULL,
	[INRtargetrange] [nvarchar](20) NULL,
	[LastINR] [nvarchar](20) NULL,
	[Lab] [nvarchar](255) NULL,
	[PortableDevice] [nvarchar](1) NULL,
	[TimeofINRTest] [nvarchar](10) NULL,
	[DateofINRTest] [nvarchar](10) NULL,
	[BleedingorClotting] [nvarchar](50) NULL,
	[PastMedicalHistory] [nvarchar](50) NULL,
	[MajorSurgery] [nvarchar](255) NULL,
	[MinorSurgery] [nvarchar](255) NULL,
	[HospitalAdmission] [nvarchar](255) NULL,
	[DrugHistory] [int] NULL,
	[Habit] [nvarchar](5) NULL,
	[BloodPressure] [nvarchar](10) NULL,
	[PulseRate] [nvarchar](10) NULL,
	[RespiratoryRate] [nvarchar](10) NULL,
	[Hb] [nvarchar](10) NULL,
	[Hct] [nvarchar](10) NULL,
	[Plt] [nvarchar](10) NULL,
	[Bun] [nvarchar](10) NULL,
	[Urea] [nvarchar](10) NULL,
	[Cr] [nvarchar](10) NULL,
	[Na] [nvarchar](10) NULL,
	[K] [nvarchar](10) NULL,
	[Alt] [nvarchar](10) NULL,
	[Ast] [nvarchar](10) NULL,
	[ECG] [nvarchar](50) NULL,
	[EF] [nvarchar](10) NULL,
	[LAVI] [nvarchar](10) NULL,
	[Comment] [ntext] NULL,
	[IDUserPatient] [int] NULL,
	[FYearVisit] [nvarchar](4) NULL,
	[FMonthVisit] [nvarchar](2) NULL,
	[FDayVisit] [nvarchar](2) NULL,
	[FFlagVisit] [nvarchar](1) NULL,
	[FFlagSave] [nvarchar](1) NULL,
	[FlagEndVisit] [nvarchar](1) NULL,
	[CommentReport] [ntext] NULL,
	[NextINRCheck] [nvarchar](10) NULL,
 CONSTRAINT [PK_FirstTbl] PRIMARY KEY CLUSTERED 
(
	[IDFirst] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [myinrir_test].[HAS-BLEDTbl]    Script Date: 5/21/2021 6:28:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [myinrir_test].[HAS-BLEDTbl](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[PatientID] [int] NOT NULL,
	[Hypertension] [int] NULL,
	[Renaldisease] [int] NULL,
	[Liverdisease] [int] NULL,
	[Stroke] [int] NULL,
	[bleeding] [int] NULL,
	[LabileINR] [int] NULL,
	[Age] [int] NULL,
	[predisposing] [int] NULL,
	[drug] [int] NULL,
 CONSTRAINT [PK_HAS-BLEDTbl] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [myinrir_test].[INRTestTbl]    Script Date: 5/21/2021 6:28:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [myinrir_test].[INRTestTbl](
	[IDINR] [int] IDENTITY(1,1) NOT NULL,
	[NewINR] [nvarchar](10) NULL,
	[TimeofINRTest] [nvarchar](10) NULL,
	[DateofINRTest] [nvarchar](10) NULL,
	[UserIDPatient] [int] NOT NULL,
 CONSTRAINT [PK_INRTestTbl] PRIMARY KEY CLUSTERED 
(
	[IDINR] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [myinrir_test].[Items]    Script Date: 5/21/2021 6:28:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [myinrir_test].[Items](
	[IDItems] [int] IDENTITY(1,1) NOT NULL,
	[NameItems] [nvarchar](255) NOT NULL,
	[groupItems] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[IDItems] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [myinrir_test].[PaDrTbl]    Script Date: 5/21/2021 6:28:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [myinrir_test].[PaDrTbl](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[Drug] [nvarchar](100) NOT NULL,
	[IDPatient] [int] NOT NULL,
	[Dateofstart] [nvarchar](50) NULL,
	[Dateofend] [nvarchar](50) NULL,
 CONSTRAINT [PK_PaDrTbl] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [myinrir_test].[SecondTbl]    Script Date: 5/21/2021 6:28:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [myinrir_test].[SecondTbl](
	[IDSecond] [int] IDENTITY(1,1) NOT NULL,
	[ReasonforusingWarfarin] [nvarchar](10) NULL,
	[ProcedurePreparing] [nvarchar](255) NULL,
	[NewINR] [nvarchar](10) NULL,
	[Lab] [nvarchar](255) NULL,
	[PortableDevice] [nvarchar](1) NULL,
	[TimeofINRTest] [nvarchar](10) NULL,
	[DateofINRTest] [nvarchar](10) NULL,
	[Hospitalized] [nvarchar](1) NULL,
	[ERVisit] [nvarchar](1) NULL,
	[BleedingorClotting] [nvarchar](50) NULL,
	[Recommendation] [nvarchar](5) NULL,
	[Stopusingwarfarin] [nvarchar](5) NULL,
	[NextINRCheck] [nvarchar](10) NULL,
	[Comment] [ntext] NULL,
	[DosageToday] [nvarchar](1) NULL,
	[DayVisit] [nvarchar](2) NULL,
	[MonthVisit] [nvarchar](2) NULL,
	[YearVisit] [nvarchar](4) NULL,
	[UserIDPatient] [int] NULL,
	[FlagVisit] [nvarchar](1) NULL,
 CONSTRAINT [PK_SecondTbl] PRIMARY KEY CLUSTERED 
(
	[IDSecond] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
ALTER TABLE [dbo].[PhysicianTbl] ADD  CONSTRAINT [DF_PhysicianTbl_GotoSecretary]  DEFAULT ((0)) FOR [GotoSecretary]
GO
ALTER TABLE [dbo].[UserTbl] ADD  CONSTRAINT [DF_UserTbl_statusUser]  DEFAULT ((1)) FOR [StatusUser]
GO
ALTER TABLE [myinrir_test].[DosageTbl] ADD  CONSTRAINT [DF_DosageTbl_PHDosage]  DEFAULT (NULL) FOR [PHDosage]
GO
ALTER TABLE [myinrir_test].[DosageTbl] ADD  CONSTRAINT [DF_bat_Batches_Version]  DEFAULT (NULL) FOR [PADosage]
GO
ALTER TABLE [myinrir_test].[FirstTbl] ADD  CONSTRAINT [DF_FirstTbl_FlagEndVisit]  DEFAULT ((0)) FOR [FlagEndVisit]
GO
USE [master]
GO
ALTER DATABASE [myinrir_test] SET  READ_WRITE 
GO
SET NOEXEC OFF
GO
