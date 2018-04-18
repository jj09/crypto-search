using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CryptoSearch.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CryptoSearch.Controllers
{
    [Route("api/[controller]")]
    public class CryptosController : Controller
    {
        private readonly CryptosContext _context;

        public CryptosController(CryptosContext context)
        {
            _context = context;
        }

        [HttpGet("[action]")]
        public IEnumerable<Tweet> Tweets()
        {
            return _context.Tweets2.ToList();
        }

        [HttpGet("[action]")]
        public IEnumerable<dynamic> TweetsAvg()
        {
            var avgs = _context.Tweets2.GroupBy(
                x => x.Date.Date,
                x => new { Crypto = x.Crypto, Sentiment = x.Sentiment },
                (k,v) => new { Date = k, Sentiment = v.GroupBy(
                    x => x.Crypto,
                    x => x.Sentiment,
                    (kk,vv) => new { Crypto = kk, Sentiment = vv.Average()}
                )}).ToList();

            return avgs;

            // var result = new Dictionary<string, Dictionary<DateTime, decimal?>>();

            // var tweets = _context.Tweets2.ToList();

            // // set time to 00:00:00
            // tweets.ForEach(tweet => {
            //     tweet.Date = tweet.Date.Date;
            // });

            // var allCryptos = tweets.Select(x => x.Crypto).Distinct();

            // var groups = tweets.GroupBy(x => x.Crypto).ToList();

            // groups.ForEach(crypto => 
            // {
            //     var dateGroups = crypto.GroupBy(x => x.Date).ToList();

            //     dateGroups.ForEach(dateGroup => 
            //     {
            //         var avg = dateGroup.Average(x => x.Sentiment);
                    
            //         if (!result.ContainsKey(crypto.Key)) 
            //         {
            //             result[crypto.Key] = new Dictionary<DateTime, decimal?>();  
            //         }
            //         result[crypto.Key][dateGroup.FirstOrDefault().Date] = avg;
            //     });
            // });

            // return result;
        }
    }
}
