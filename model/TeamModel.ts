import Player from "./PlayerModel";

interface Team {
    id: number;
    teamName: string;
    abbreviation: string;
    Players: Player[];
}

export default Team;