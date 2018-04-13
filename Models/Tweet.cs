using System;
using Microsoft.EntityFrameworkCore;

namespace CryptoSearch.Models
{
    public class Tweet
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public string Text { get; set; }

        public decimal? Sentiment { get; set; }
        public string Crypto { get; set; }
    }

    public class CryptosContext : DbContext
    {
        public CryptosContext(DbContextOptions<CryptosContext> options)
            : base(options)
        { }

        public DbSet<Tweet> Tweets2 { get; set; }
    }
}