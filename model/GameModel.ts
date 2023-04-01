import Team from "./TeamModel";

interface GameModel {
    id: number;
    hostTeam: Team;
    guestTeam: Team;
    winnerId: number;
    loserId: number;
}

export default GameModel;