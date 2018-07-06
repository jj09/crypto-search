-- Create table

CREATE TABLE [dbo].[Tweets2](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Date] [datetime] NOT NULL,
	[Text] [varchar](max) NOT NULL,
	[Sentiment] [decimal](18, 17) NULL,
	[Crypto] [varchar](50) NOT NULL,
 CONSTRAINT [PK_Tweets2] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

-- Query

SELECT TOP 100 *
FROM Tweets2
WHERE Crypto <> 'bitcoin' AND Crypto <> 'ethereum'

SELECT Crypto, dateadd(DAY,0, datediff(day,0, Date)) as Date, AVG(Sentiment) as Sentiment
FROM Tweets2
GROUP BY dateadd(DAY,0, datediff(day,0, Date)), Crypto
ORDER BY Crypto 


SELECT CONVERT(date, [t].[Date]) AS [Date], [t].[Crypto], AVG(CAST([t].[Sentiment] AS decimal(18, 2))) AS [Sentiment]
FROM [Tweets2] AS [t]
GROUP BY CONVERT(date, [t].[Date]), [t].[Crypto]

SELECT TOP 100 *
FROM Articles