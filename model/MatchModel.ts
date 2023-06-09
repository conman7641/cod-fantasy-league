import Team from "./TeamModel";

interface MatchModel {
    id: number;
    hostTeam: Team;
    guestTeam: Team;
    winnerId: number;
    loserId: number;
    matchDate: Date;
}

export default MatchModel;