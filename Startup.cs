using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CryptoSearch.Models;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SpaServices.Webpack;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace CryptoSearch
{
    public class Startup
    {
        // modified to handle secrets
        public Startup(IConfiguration configuration)
        {
            var builder = new ConfigurationBuilder();

            builder.AddUserSecrets<Startup>();  // https://docs.microsoft.com/en-us/aspnet/core/security/app-secrets?tabs=visual-studio-code

            Configuration = builder.Build();

            foreach(var item in configuration.AsEnumerable())
            {
                Configuration[item.Key] = item.Value;
            }            
        }

        // source: https://github.com/aspnet/Docs/blob/master/aspnetcore/security/app-secrets/sample/UserSecrets/Startup.cs
        public Startup(IHostingEnvironment env)
        {
            var builder = new ConfigurationBuilder();

            if (env.IsDevelopment())
            {
                builder.AddUserSecrets<Startup>();
            }

            Configuration = builder.Build();
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc();

            var dbuser = Configuration["dbuser"];   // dotnet user-secrets set dbuser <SECRET>
            var dbpass = Configuration["dbpass"];   // dotnet user-secrets set dbpass <SECRET>

            var connection = $@"Server=tcp:cryptosearch.database.windows.net,1433;Initial Catalog=cryptodb;Persist Security Info=False;User ID={dbuser};Password={dbpass};MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;";
            services.AddDbContext<CryptosContext>(options => options.UseSqlServer(connection));
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseWebpackDevMiddleware(new WebpackDevMiddlewareOptions
                {
                    HotModuleReplacement = true,
                    ReactHotModuleReplacement = true
                });                
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            }

            app.UseStaticFiles();

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");

                routes.MapSpaFallbackRoute(
                    name: "spa-fallback",
                    defaults: new { controller = "Home", action = "Index" });
            });
        }
    }
}
