using System;
using Microsoft.EntityFrameworkCore;

namespace CryptoSearch.Models
{   
    public class CryptosContext : DbContext
    {
        public CryptosContext(DbContextOptions<CryptosContext> options)
            : base(options)
        { }

        public DbSet<Tweet> Tweets2 { get; set; }
        public DbSet<Article> Articles { get; set; }
    }
}