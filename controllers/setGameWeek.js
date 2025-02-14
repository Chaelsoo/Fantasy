async function setCurrentGameweek(gameweekId) {
    await prisma.appState.upsert({
      where: { id: 1 }, // Assuming there's only one row in the AppState table
      update: { currentGameweekId: gameweekId },
      create: { currentGameweekId: gameweekId },
    });
    console.log(`Current gameweek set to ${gameweekId}`);
  }