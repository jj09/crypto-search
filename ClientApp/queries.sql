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
