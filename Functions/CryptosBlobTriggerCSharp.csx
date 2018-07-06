#r "System.Configuration"
#r "System.Data"
#r "Newtonsoft.Json"

using System;
using System.Configuration;
using System.Data.SqlClient;
using System.IO;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using Newtonsoft.Json;
     
public static async Task Run(Stream myBlob, string name, TraceWriter log)
{
    try
    {
        var serializer = new JsonSerializer();

        var connectionString = ConfigurationManager.ConnectionStrings["sqldb_connection"].ConnectionString;
        var ocpApimSubscriptionKey = ConfigurationManager.ConnectionStrings["Ocp-Apim-Subscription-Key"].ConnectionString;
        var httpClient = new HttpClient();
        httpClient.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", ocpApimSubscriptionKey);
                    
        using (var sr = new StreamReader(myBlob))
        using (var jsonTextReader = new JsonTextReader(sr))
        {
            var articles = (Article[])serializer.Deserialize(jsonTextReader, typeof(Article[]));

            foreach(var article in articles)
            {
                log.Info(article.headline);            

                var payload = new Payload();
                payload.documents.Add(new Document(1,article.headline));
                var dataJson = JsonConvert.SerializeObject(payload);
                byte[] byteData = Encoding.UTF8.GetBytes(dataJson);            

                using (var content = new ByteArrayContent(byteData))
                {
                    content.Headers.ContentType = new MediaTypeHeaderValue("application/json");
                    var response = await httpClient.PostAsync("https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/sentiment", content);

                    var responseString = await response.Content.ReadAsStringAsync();
                    var result = JsonConvert.DeserializeObject<Result>(responseString);
                    var sentiment = result.documents[0].score;
                    log.Info($"Sentiment: {sentiment}");
                    
                    var crypto = "unknown";
                    
                    if (article.headline.ToLower().Contains("bitcoin"))
                    {
                        crypto = "bitcoin";
                    }
                    else if (article.headline.ToLower().Contains("ethereum"))
                    {
                        crypto = "ethereum";
                    }

                    using (var conn = new SqlConnection(connectionString))
                    {
                        conn.Open();
                        
                        var insertquery = @"INSERT INTO [dbo].[Articles] (Date, Text, Sentiment, Crypto) 
                                            VALUES (@date, @text, @sentiment, @crypto)";

                        using (var cmd = new SqlCommand(insertquery, conn))
                        {
                            cmd.Parameters.AddWithValue("@date", article.publishedDateTime);
                            cmd.Parameters.AddWithValue("@text", article.headline);
                            cmd.Parameters.AddWithValue("@sentiment", sentiment);
                            cmd.Parameters.AddWithValue("@crypto", crypto);
                            log.Info($"executing...");
                            var rows = await cmd.ExecuteNonQueryAsync();
                            log.Info($"{rows} rows were updated");
                        }
                    }
                }
            }
        }
    }
    catch (Exception e)
    {
        log.Info("EXCEPTION: " + e.ToString());
        throw;
    }
}

public class Article
{
    public string id { get; set; }
    public string category { get; set; }
    public string description { get; set; }
    public string headline { get; set; }
    public string imageUrl { get; set; }
    public string[] keyPhrases { get; set; }
    public string keyPhrasesSummary { get; set; }
    public string language { get; set; }
    public string partitionKey { get; set; }
    public DateTime publishedDateTime { get; set; }
    public int publishedYear { get; set; }
    public string source { get; set; }
    public string subCategory { get; set; }
    public DateTime textAnalyticsTimestamp { get; set; }
    public string url { get; set; }
}

public class Payload
{
    public Payload()
    {
        documents = new List<Document>();
    }

    public List<Document> documents { get; set; }
}

public class Document
{
    public Document(int id, string text)
    {
        this.id = id.ToString();
        this.text = text;
        this.language = "en";
    }

    public string language { get; set; }
    public string id { get; set; }
    public string text { get; set; }
}

public class Result
{
    public List<ResultDocument> documents { get; set; }
}

public class ResultDocument
{
    public int id { get; set; }
    public decimal score { get; set; }
}