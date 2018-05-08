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
            var avgs =
                from t in _context.Tweets2
                group t.Sentiment by new { t.Date.Date, t.Crypto } into g
                select new { g.Key.Date, g.Key.Crypto, Sentiment = g.Average() };

            return avgs.ToList();
        }

        [HttpGet("[action]")]
        public IEnumerable<dynamic> ArticlesAvg()
        {
            var avgs =
                from t in _context.Articles
                group t.Sentiment by new { t.Date.Date, t.Crypto } into g
                select new { g.Key.Date.Date, g.Key.Crypto, Sentiment = g.Average() };

            return avgs.ToList();
        }
    }
}
