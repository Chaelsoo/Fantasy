const fs = require("fs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
// Read JSON file
const rawData = fs.readFileSync("data.json");
const clubData = JSON.parse(rawData);

async function seedDatabase() {
  try {
    console.log("Seeding database...");

    for (const club of clubData.clubs) {
      // Insert club
      const createdClub = await prisma.club.create({
        data: {
          name: club.club_name,
        },
      });

      console.log(`Created Club: ${createdClub.name}`);

      // Insert players for the club
      for (const player of club.players) {
        await prisma.player.create({
          data: {
            name: player.name,
            position: player.position,
            price: player.price,
            clubId: createdClub.id, // Foreign key
            logoUrl: club.kit_image_url,

          },
        });
      }

      console.log(`Added players for ${createdClub.name}`);
    }

    console.log("Seeding completed!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Execute seeding
seedDatabase();

