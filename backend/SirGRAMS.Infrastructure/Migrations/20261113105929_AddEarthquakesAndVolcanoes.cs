using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SirGRAMS.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddEarthquakesAndVolcanoes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("Npgsql:PostgresExtension:postgis", ",,");

            migrationBuilder.CreateTable(
                name: "Earthquakes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ExternalId = table.Column<string>(type: "text", nullable: false),
                    Magnitude = table.Column<double>(type: "double precision", nullable: false),
                    DepthKm = table.Column<double>(type: "double precision", nullable: false),
                    Latitude = table.Column<double>(type: "double precision", nullable: false),
                    Longitude = table.Column<double>(type: "double precision", nullable: false),
                    LocationDescription = table.Column<string>(type: "text", nullable: false),
                    OccurredAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Earthquakes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "VolcanoBulletins",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    VolcanoId = table.Column<Guid>(type: "uuid", nullable: false),
                    ExternalId = table.Column<string>(type: "text", nullable: false),
                    BulletinDate = table.Column<DateOnly>(type: "date", nullable: false),
                    AlertLevel = table.Column<int>(type: "integer", nullable: false),
                    AlertDescription = table.Column<string>(type: "text", nullable: false),
                    VolcanicEarthquakeCount = table.Column<int>(type: "integer", nullable: true),
                    SulfurDioxideTonnesPerDay = table.Column<double>(type: "double precision", nullable: true),
                    Plume = table.Column<string>(type: "text", nullable: true),
                    GroundDeformation = table.Column<string>(type: "text", nullable: true),
                    SourceUrl = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VolcanoBulletins", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Volcanoes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Code = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Latitude = table.Column<double>(type: "double precision", nullable: false),
                    Longitude = table.Column<double>(type: "double precision", nullable: false),
                    Province = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Volcanoes", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Earthquakes");

            migrationBuilder.DropTable(
                name: "VolcanoBulletins");

            migrationBuilder.DropTable(
                name: "Volcanoes");
        }
    }
}
