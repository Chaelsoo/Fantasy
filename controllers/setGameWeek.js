
async function setCurrentGameweek(gameweekId) {
    await prisma.appState.upsert({
      where: { id: 1 }, 
      update: { currentGameweekId: gameweekId },
      create: { currentGameweekId: gameweekId },
    });
    console.log(`Current gameweek set to ${gameweekId}`);
  }