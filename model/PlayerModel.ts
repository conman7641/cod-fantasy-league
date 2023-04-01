
interface Player {
    id: number;
    name: string;
    alias: string;
    kills: number;
    deaths: number;
    assists: number;
    nonTradeKills: number;
    hillTime: number;
    MatchKD: number;
}

export default Player;