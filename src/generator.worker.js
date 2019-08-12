import MersenneTwister from "mersenne-twister";
let mersenne = null, players = [], roundCount = 0, rounds = [];

self.updateProgress = progress => self.postMessage({ topic: 'progress', progress: progress });

self.addEventListener('message', (event) => {
  self.mersenne = new MersenneTwister(event.data.seed);
  self.players = event.data.players;
  self.roundCount = event.data.roundCount;
  generateRounds();
})

self.generateRounds = () => {
  self.rounds = [];
  for (var roundNum = 1; roundNum <= self.roundCount; roundNum++) {
    let round;
    console.log(Math.floor(self.rounds.length / self.roundCount * 100));
    self.updateProgress(Math.floor(self.rounds.length / self.roundCount * 100));
    self.postMessage({ topic: 'rounds', rounds: self.rounds });
    for (var attempts = 0; attempts <= 1000000; attempts++) {
      try {
        round = createRound(roundNum, false);
      } catch (e) {
        continue;
      }
      self.rounds.push(round);
      break;
    }
    if (!round) {
      for (var attempts = 0; attempts <= 1000000; attempts++) {
        try {
          round = createRound(roundNum, true);
        } catch (e) {
          continue;
        }
        self.rounds.push(round);
        break;
      }
    }

    if (!round) {
      self.updateProgress(0);
      break;
    }
  }
  self.postMessage({ topic: 'rounds', rounds: self.rounds });
  self.postMessage({ topic: 'complete' });

}


self.shuffle = (arr) => {
  // distilled from chancejs
  var new_array = [],
    j = 0,
    length = Number(arr.length),
    source_indexes = Array.apply(null, Array(length)).map(function (_, i) {
      return i;
    }),
    last_source_index = length - 1,
    selected_source_index;

  for (var i = 0; i < length; i++) {
    // Pick a random index from the array
    selected_source_index = Math.floor(
      self.mersenne.random() * last_source_index
    );
    j = source_indexes[selected_source_index];

    // Add it to the new array
    new_array[i] = arr[j];

    // Mark the source index as used
    source_indexes[selected_source_index] =
      source_indexes[last_source_index];
    last_source_index -= 1;
  }

  return new_array;
}

function createRound(roundNum, sameTableConflict) {
  const tables = [];
  // shuffle then remove any players that are restricted to a table
  let p = self.shuffle(self.players).filter(i => i.table == null);
  self.players
    .filter(i => i.table != null)
    .map(i => {
      p.splice((i.table - 1) * 4, 0, i);
    });

  for (var table = 1; table <= self.players.length / 4; table++) {
    const t = {
      id: roundNum * 1000 + table,
      round: roundNum,
      table: table,
      team1: { player1: p.shift(), player2: p.shift() },
      team2: { player1: p.shift(), player2: p.shift() }
    };
    self.checkConflict(t, sameTableConflict);
    tables.push(t);
  }
  return { id: roundNum, tables: tables };
}


self.checkConflict = (table, sameTableConflict) => {
  self.rounds.forEach(r => {
    r.tables.forEach(t => {
      const group1 = [
        t.team1.player1.id,
        t.team1.player2.id,
        t.team2.player1.id,
        t.team2.player2.id
      ];
      const group2 = [
        table.team1.player1.id,
        table.team1.player2.id,
        table.team2.player1.id,
        table.team2.player2.id
      ];
      let conflict = self.intersect(group1, group2);

      if (conflict.length >= 2) {
        let sameTeam1 = self.intersect(conflict, [
          t.team1.player1.id,
          t.team1.player2.id
        ]);
        let sameTeam2 = self.intersect(conflict, [
          t.team2.player1.id,
          t.team2.player2.id
        ]);
        if (
          (!sameTableConflict && sameTeam1.length >= 2) ||
          sameTeam2.length >= 2
        ) {
          throw new Error("conflict");
        }
      }
    });
  });
}

self.intersect = (group1, group2) => {
  return group1.filter(p => group2.includes(p));
}