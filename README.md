# crypto-search

Playing with Azure Search and Cryptos

## About

This project is taking advantage of Azure Search and Text Analytics API to analyze crypto currencies trends. 

Tweets are being streamed to Event Hub, which triggers Azure Function that calls Text Analytics API to calculate sentiment of tweet. Then tweets and its sentiments are inserted into SQL Database. Azure Search index allows to effectively search through tweets. This index is being syncronized with SQL DB through integrated change tracking, and Azure Search indexer that runs on schedule.

<img src="https://jj09.net/wp-content/uploads/2018/06/cognitive_search_architecture.png" alt="Cognitive Search Architecture" />

It can be used for any topic analysis. More details in <a href="https://jj09.net/qcon-conferences-real-experts-experience-exchange/">this blog post</a>

## Running

### Required:
  
  1. Create SQL DB and <a href="https://github.com/jj09/crypto-search/blob/master/ClientApp/queries.sql">table Tweets2</a>
  2 Update `connection` in `ConfigureServices` method in <a href="https://github.com/jj09/crypto-search/blob/master/Startup.cs">Startup.cs</a> 
  3. Set user and password secrets in cmd:
      
      * `dotnet user-secrets set dbuser <SECRET>`
      * `dotnet user-secrets set dbpass <SECRET>`
      
  4. <a href="https://docs.microsoft.com/en-us/azure/search/search-create-service-portal">Create Azure Search Service</a> and <a href="https://docs.microsoft.com/en-us/azure/search/search-howto-connecting-azure-sql-database-to-azure-search-using-indexers">connect to SQL DB using Indexer</a>
  5. Update `index`, `queryKey` and `service` in `componentDidMount` function in <a href="https://github.com/jj09/crypto-search/blob/master/ClientApp/components/CryptosAzs.tsx">CryptosAzs.tsx</a>

### Optional:

  1. Create <a href="https://docs.microsoft.com/en-us/azure/event-hubs/event-hubs-create">Azure Event Hub</a>
  2. Create Text Analytics Cognitive Service in Azure Portal.
  3. Create Azure Function (Event Hub trigerred) to call Text Analytics API and insert result into SQL DB. You can check <a href="https://github.com/jj09/crypto-search/blob/master/Functions/CryptoSentimentEventHubTrigger.csx">CryptoSentimentEventHubTrigger.csx</a> and <a href="https://github.com/jj09/crypto-search/blob/master/Functions/CryptosBlobTriggerCSharp.csx">CryptosBlobTriggerCSharp.csx</a> functions for reference.
  4. You can use <a href="https://github.com/Azure/azure-stream-analytics/blob/master/Samples/TwitterClient/TwitterWPFClient.zip">TwitterClientWPF</a> to stream tweets to EventHub.
