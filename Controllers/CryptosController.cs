using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace crypto_search.Controllers
{
    [Route("api/[controller]")]
    public class CryptosController : Controller
    {

        [HttpGet("[action]")]
        public IEnumerable<Tweet> Tweets()
        {
            return Enumerable.Range(1, 5).Select(index => new Tweet
            {
                Id = index,
                Date = DateTime.Now.AddDays(index).ToString("d"),
                Text = "Lorem ipsum",
                Sentiment = (decimal)new Random().NextDouble(),
                Crypto = new Random().NextDouble() < 0.5 ? "bitcoin" : "ethereum"
            });
        }

        public class Tweet
        {
            public int Id { get; set; }
            public string Date { get; set; }
            public string Text { get; set; }

            public decimal Sentiment { get; set; }
            public string Crypto { get; set; }
        }
    }
}
