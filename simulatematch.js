async function simulateMatch(players, gameweekId) {
    const matchDuration = 300;
    //backend
    const socket = new WebSocket('ws://url'); 
  
    socket.onopen = () => {
      console.log('WebSocket connection established');
    };
  
    for (let i = 0; i < matchDuration; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second
  
      const player = players[Math.floor(Math.random() * players.length)];
  
      const eventType = Math.random();
      if (eventType < 0.01) {
        const event = { playerId: player.id, event: 'goal' };
        socket.send(JSON.stringify(event));
      } else if (eventType < 0.02) {
        const event = { playerId: player.id, event: 'assist' };
        socket.send(JSON.stringify(event));
      } else if (eventType < 0.025) {
        const event = { playerId: player.id, event: 'yellowCard' };
        socket.send(JSON.stringify(event));
      } else if (eventType < 0.026) {
        const event = { playerId: player.id, event: 'redCard' };
        socket.send(JSON.stringify(event));
      }
    }
  
    socket.close();
    console.log('Match simulation complete');
  }
  
  // Example usage
  const players = [
    { id: 1, name: 'Player 1' },
    { id: 2, name: 'Player 2' },
  ];
  
  simulateMatch(players, 1); 