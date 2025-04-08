
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace orca.Code.Auth {
    public class AuthDBContext : IdentityDbContext<IdentityUser> {
        public AuthDBContext(DbContextOptions<AuthDBContext> options) :
        base(options) {
            /*
                Install-Package Microsoft.EntityFrameworkCore.Tools
                Add-Migration Auth01
                Update-Database
             */
        }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) {
            string cnString = orca.ConfigurationManager.AppSetting["ConnectionStrings:" + orca.ConfigurationManager.AppSetting["AuthDB"]];
            var serverVersion = ServerVersion.AutoDetect(cnString);
            optionsBuilder.UseMySql(cnString, serverVersion);
        }
    }
}
