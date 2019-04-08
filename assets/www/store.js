// =================================================================================================
// VUE STORE
// =================================================================================================
const store = new Vuex.Store({
    // Global generic purpose states
    state: {
        finishedLoading: false,
        docs: null, // Tous les documents sont mis en mémoire !! Optimisation possible plus tard ... il faudrait juste garder les joueurs et la session en cours
    },
    getters: {
        getTeams: (state) => {
            let teams = [];
            if (state.docs !== undefined) {
                let docs = state.docs.filter(doc => doc._id.includes(Api.getSessionId()));
                if (docs.length == 1) {
                    teams = docs[0].teams;
                } else {
                    console.log("[STORE] No session found!");
                }
            } else {
                console.log("[STORE] Database not loaded!");
            }
            return teams;
        },
        getRounds: (state) => {
            let rounds = [];
            if (state.docs !== undefined) {
                let docs = state.docs.filter(doc => doc._id.includes(Api.getSessionId()));
                if (docs.length == 1) {
                    rounds = docs[0].rounds;
                } else {
                    console.log("[STORE] No session found!");
                }
            } else {
                console.log("[STORE] Database not loaded!");
            }
            return rounds;
        },
        getPlayer: (state) => (playerId) => {
            let player = null;
            if (state.docs !== undefined) {
                let docs = state.docs.filter(doc => doc._id.includes(playerId));
                if (docs.length == 1) {
                    player = docs[0];
                }
            }
            return player;
        },
        getTeamName(item) {
            var players = [];
            for (var i = 0; i < item.players.length; i++) {
              players.push(this.$store.getters.getPlayer(item.players[i]).firstname);
            }
            return players.join('/');
        }
    },
    actions: {
        addPlayer: (context, player) => {
            return Api.addPlayer(player);
        },
        addTeam: (context, players) => {
            return Api.addTeam(players);
        },
        deleteTeam: (context, indexList) => {
            return Api.deleteTeam(indexList)
        },
        createRounds: (context) => {
            return Api.createRounds();
        }
    },
    mutations: {
        SET_FINISHED_LOADING: (state) => {
            state.finishedLoading = true;
        },
        SET_DOCS: (state, docs) => {
            state.docs = docs;
        },
        DB_UPDATE: (state, newDoc) => {
            var index = Api.binarySearch(state.docs, newDoc._id);
            var doc = state.docs[index];
            if (doc && doc._id === newDoc._id) { // update
                // state.docs[index] = newDoc; // This is not detected by Vue
                Vue.set(state.docs, index, newDoc); // instead use this

                console.log("[DB] Document updated");
            } else { // insert
                state.docs.splice(index, 0, newDoc);
                console.log("[DB] Document inserted");
            }
        },
        DB_DELETE: (state, id) => {
            var index = Api.binarySearch(docs, id);
            var doc = state.docs[index];
            if (doc && doc._id === id) {
                console.log("[DB] Document deleted");
                state.docs.splice(index, 1);
            }
        }
    },
    strict: true
});