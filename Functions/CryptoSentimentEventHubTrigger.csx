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

public static async Task Run(string myEventHubMessage, TraceWriter log)
{
    try
    {
        log.Info($"C# Event Hub trigger function processed a message: {myEventHubMessage}");

        var tweet = Tweet.FromJson(myEventHubMessage);

        log.Info($"Tweet text: {tweet.Text}");

        var connectionString = ConfigurationManager.ConnectionStrings["sqldb_connection"].ConnectionString;
        var ocpApimSubscriptionKey = ConfigurationManager.ConnectionStrings["Ocp-Apim-Subscription-Key"].ConnectionString;
        var httpClient = new HttpClient();
        httpClient.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", ocpApimSubscriptionKey);

        var payload = new Payload();
        payload.documents.Add(new Document(1,tweet.Text));
        var dataJson = JsonConvert.SerializeObject(payload);
        byte[] byteData = Encoding.UTF8.GetBytes(dataJson);

        using (var content = new ByteArrayContent(byteData))
        {
            content.Headers.ContentType = new MediaTypeHeaderValue("application/json");
            var response = await httpClient.PostAsync("https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/sentiment", content);

            var result = JsonConvert.DeserializeObject<Result>(response.Content.ReadAsStringAsync().Result);
            var sentiment = result.documents[0].score;
            log.Info($"Sentiment: {sentiment}");

            using (var conn = new SqlConnection(connectionString))
            {
                conn.Open();
                var insertquery = @"INSERT INTO [dbo].[Tweets2] (Date, Text, Sentiment, Crypto) 
                                    VALUES (@date, @text, @sentiment, @crypto)";

                using (var cmd = new SqlCommand(insertquery, conn))
                {
                    cmd.Parameters.AddWithValue("@date", tweet.CreatedAt.DateTime);
                    cmd.Parameters.AddWithValue("@text", tweet.Text);
                    cmd.Parameters.AddWithValue("@sentiment", sentiment);
                    cmd.Parameters.AddWithValue("@crypto", tweet.Topic);

                    var rows = await cmd.ExecuteNonQueryAsync();
                    log.Info($"{rows} rows were updated");
                }
            }
        }
    }
    catch (Exception e)
    {
        log.Info(e.ToString());
        throw;
    } 
}


// DTO classes

public class Tweet
{
    [JsonProperty("CreatedAt")]
    public System.DateTimeOffset CreatedAt { get; set; }

    [JsonProperty("Topic")]
    public string Topic { get; set; }

    [JsonProperty("SentimentScore")]
    public long SentimentScore { get; set; }

    [JsonProperty("Author")]
    public string Author { get; set; }

    [JsonProperty("Text")]
    public string Text { get; set; }

    [JsonProperty("SendExtended")]
    public bool SendExtended { get; set; }

    public static Tweet FromJson(string json) => JsonConvert.DeserializeObject<Tweet>(json);
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