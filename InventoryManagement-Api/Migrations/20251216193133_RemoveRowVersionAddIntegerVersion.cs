using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InventoryManagement_API.Migrations
{
    /// <inheritdoc />
    public partial class RemoveRowVersionAddIntegerVersion : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RowVersion",
                table: "Products");

            migrationBuilder.AddColumn<int>(
                name: "Version",
                table: "Products",
                type: "integer",
                rowVersion: true,
                nullable: false,
                defaultValue: 1);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Version",
                table: "Products");

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                table: "Products",
                type: "bytea",
                rowVersion: true,
                nullable: false,
                defaultValue: new byte[0]);
        }
    }
}
