
using Microsoft.AspNetCore.DataProtection.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace orca.Code.Auth {
    public class AuthDBContext : IdentityDbContext<IdentityUser>, IDataProtectionKeyContext {
        public AuthDBContext(DbContextOptions<AuthDBContext> options) :
        base(options) {
            /*
                Install-Package Microsoft.EntityFrameworkCore.Tools
                Add-Migration Auth01
                Update-Database
             */
        }

        public DbSet<DataProtectionKey> DataProtectionKeys { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) {
            string cnString = orca.ConfigurationManager.AppSetting["ConnectionStrings:" + orca.ConfigurationManager.AppSetting["AuthDB"]];
            var serverVersion = new MySqlServerVersion(new Version(8, 0, 0));
            optionsBuilder.UseMySql(cnString, serverVersion);
        }
    }
}
