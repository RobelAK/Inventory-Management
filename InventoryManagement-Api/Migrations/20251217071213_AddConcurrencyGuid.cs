using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InventoryManagement_API.Migrations
{
    /// <inheritdoc />
    public partial class AddConcurrencyGuid : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Version",
                table: "Products");

            migrationBuilder.AddColumn<Guid>(
                name: "ConcurrencyGuid",
                table: "Products",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ConcurrencyGuid",
                table: "Products");

            migrationBuilder.AddColumn<int>(
                name: "Version",
                table: "Products",
                type: "integer",
                rowVersion: true,
                nullable: false,
                defaultValue: 1);
        }
    }
}
