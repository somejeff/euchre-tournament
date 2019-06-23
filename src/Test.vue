<template>
  <div>
    <v-text-field v-model="roundCount" label="Rounds"></v-text-field>
    <v-text-field v-model="seed" label="Seed"></v-text-field>
    <v-btn @click="generate()" :loading="loading">Go</v-btn>
    {{ rounds }}
  </div>
</template>

<script>
//import CalcWorker from "@/calc.worker.js";

export default {
  data() {
    return {
      worker: null,
      players: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      rounds: null,
      loading: false,
      roundCount: 6,
      seed: 1
    };
  },
  created() {
    this.worker = this.$worker.create([
      {
        message: "calculate",
        func: (players, roundCount, seed) => {
          console.log("IN", players);
          let mersenneFunc = function(seed) {
            this.seed = seed * 1;
            this.N = 624;
            this.M = 397;
            this.MATRIX_A = 0x9908b0df;
            this.UPPER_MASK = 0x80000000;
            this.LOWER_MASK = 0x7fffffff;
            this.mt = new Array(this.N);
            this.mti = this.N + 1;
            this.mt[0] = seed >>> 0;
            for (this.mti = 1; this.mti < this.N; this.mti++) {
              var s = this.mt[this.mti - 1] ^ (this.mt[this.mti - 1] >>> 30);
              this.mt[this.mti] =
                ((((s & 0xffff0000) >>> 16) * 1812433253) << 16) +
                (s & 0x0000ffff) * 1812433253 +
                this.mti;
              this.mt[this.mti] >>>= 0;
            }
            this.random = function() {
              var y;
              var mag01 = new Array(0x0, this.MATRIX_A);
              if (this.mti >= this.N) {
                var kk;
                for (kk = 0; kk < this.N - this.M; kk++) {
                  y =
                    (this.mt[kk] & this.UPPER_MASK) |
                    (this.mt[kk + 1] & this.LOWER_MASK);
                  this.mt[kk] =
                    this.mt[kk + this.M] ^ (y >>> 1) ^ mag01[y & 0x1];
                }
                for (; kk < this.N - 1; kk++) {
                  y =
                    (this.mt[kk] & this.UPPER_MASK) |
                    (this.mt[kk + 1] & this.LOWER_MASK);
                  this.mt[kk] =
                    this.mt[kk + (this.M - this.N)] ^
                    (y >>> 1) ^
                    mag01[y & 0x1];
                }
                y =
                  (this.mt[this.N - 1] & this.UPPER_MASK) |
                  (this.mt[0] & this.LOWER_MASK);
                this.mt[this.N - 1] =
                  this.mt[this.M - 1] ^ (y >>> 1) ^ mag01[y & 0x1];

                this.mti = 0;
              }
              y = this.mt[this.mti++];
              y ^= y >>> 11;
              y ^= (y << 7) & 0x9d2c5680;
              y ^= (y << 15) & 0xefc60000;
              y ^= y >>> 18;

              return y >>> 0;
            };
            this.shuffle = function(players) {
              let playerIndex = players.length,i,t;
              while (playerIndex) {
                i = Math.floor(this.random() * playerIndex--);
                t = players[playerIndex];
                players[playerIndex] = players[i];
                players[i] = t;
              }
              return players;
            };
          };
          let mersenne = new mersenneFunc(seed);

          let rounds = mersenne.shuffle(players);
          console.log("out", rounds);
          return rounds;
        }
      }
    ]);
  },
  methods: {
    generate() {
      this.loading = true;
      this.worker
        .postMessage("calculate", [this.players, this.roundCount, this.seed])
        .then(data => {
          this.rounds = data;
          this.loading = false;
        });
    }
  }
};
</script>

<style>
</style>
