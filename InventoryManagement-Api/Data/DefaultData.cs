using InventoryManagement.Api.Models;
using Microsoft.AspNetCore.Identity;

namespace InventoryManagement.Data
{
    public class DefaultData
    {
        public static async Task InitializeAsync(UserManager<AppUser> userManager)
        {
            var email = "InventoryManager@gmail.com";
            var password = "Q1W2q1w2!@!@";

            if (await userManager.FindByEmailAsync(email) == null)
            {
                var user = new AppUser
                {
                    UserName = email,
                    Email = email,
                    EmailConfirmed = true // Optional: skip email confirmation
                };

                var result = await userManager.CreateAsync(user, password);

                if (result.Succeeded)
                {
                    // Optional: Add to role if you have roles
                    // await userManager.AddToRoleAsync(user, "Admin");
                }
            }
        }
    }
}