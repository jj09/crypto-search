SELECT TOP 100 *
FROM Tweets2
WHERE Crypto <> 'bitcoin' AND Crypto <> 'ethereum'

CREATE VIEW Tweets2Avg AS SELECT Crypto, dateadd(DAY,0, datediff(day,0, Date)) as Date, AVG(Sentiment) as Sentiment
FROM Tweets2
GROUP BY dateadd(DAY,0, datediff(day,0, Date)), Crypto

UPDATE Tweets2
SET Crypto = 'monero'
WHERE Crypto = 'eor'

SELECT *
FROM Tweets2Avg


SELECT Crypto, dateadd(DAY,0, datediff(day,0, Date)) as Date, AVG(Sentiment) as Sentiment
FROM Tweets2
GROUP BY dateadd(DAY,0, datediff(day,0, Date)), Crypto
ORDER BY Crypto 