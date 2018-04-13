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

            // return Enumerable.Range(1, 5).Select(index => new Tweet
            // {
            //     Id = index,
            //     Date = DateTime.Now.AddDays(index).ToString("d"),
            //     Text = "Lorem ipsum",
            //     Sentiment = (decimal)new Random().NextDouble(),
            //     Crypto = new Random().NextDouble() < 0.5 ? "bitcoin" : "ethereum"
            // });
        }        
    }
}
