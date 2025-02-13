

function generateMatchups(clubs) {
    const matchups = [];
    const shuffledClubs = [...clubs].sort(() => Math.random() - 0.5); // Shuffle clubs
  
    for (let i = 0; i < shuffledClubs.length; i += 2) {
      if (i + 1 < shuffledClubs.length) {
        matchups.push([shuffledClubs[i], shuffledClubs[i + 1]]);
      }
    }
  
    return matchups;
  }