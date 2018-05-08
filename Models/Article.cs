using System;
using Microsoft.EntityFrameworkCore;

namespace CryptoSearch.Models
{
    public class Article
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public string Text { get; set; }

        public decimal? Sentiment { get; set; }
        public string Crypto { get; set; }
    }

    
}