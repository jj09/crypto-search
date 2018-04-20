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
                    (kk,vv) => new { Crypto = kk, Sentiment = vv.Average() }
                )}).ToList();

            return avgs;
        }
    }
}
