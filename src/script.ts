const Excel = require('exceljs')
import TeamModel from '../model/TeamModel'
import PlayerModel from '../model/PlayerModel'
import GameData from '../model/GameModel'
import * as path from 'path';
import GameModel from '../model/GameModel';

const workbook = new Excel.Workbook()
const worksheet = workbook.addWorksheet("Game Stats")

for (let i = 0; i < 40; i++) {
    const gameid = 8750 + i
    const url = `https://cdl-other-services.abe-arsfutura.com/production/v2/content-types/match-detail/bltd79e337aca601012?locale=en-us&options=%7B%22id%22%3A${gameid}%7D`

    const data = getData(url).then(data => {
        if (data === null || data.data.matchData.matchExtended.match.status !== 'COMPLETED') {
            return;
        }
        const homeTeam = setTeamData(data.data.matchData.matchExtended.homeTeamCard) //get home team
        const homePlayers = setPlayerData(data.data.matchData.matchStats.overall.hostTeam) //get home players
        const awayTeam = setTeamData(data.data.matchData.matchExtended.awayTeamCard) //get away team
        const awayPlayers = setPlayerData(data.data.matchData.matchStats.overall.guestTeam) //get away players

        homeTeam.Players = homePlayers
        awayTeam.Players = awayPlayers

        const game = setGameData(data.data.matchData.matchExtended, homeTeam, awayTeam)

        writeData([game], 8750 + i)
    })
}

    async function getData(url: string) {
        const data = await fetch(url, {
            headers: {
                'x-origin': 'callofdutyleague.com',
            }
        })
        try {
            const json = await data.json()
            return json
        } catch (error) {
            return null
        }
    }
    function setTeamData(data: any) {
        const team: TeamModel = {
            id: data.id,
            teamName: data.name,
            abbreviation: data.abbreviation,
            Players: []
        }
        return team
    }

    function setPlayerData(data: any) {
        //Home Team
        const Players: PlayerModel[] = []
        for (let i = 0; i < data.length; i++) {
            const player: PlayerModel = {
                id: data[i].id,
                name: data[i].firstName + ' ' + data[i].lastName,
                alias: data[i].alias,
                kills: data[i].stats.totalKills,
                deaths: data[i].stats.totalDeaths,
                assists: data[i].stats.totalAssists,
                nonTradeKills: data[i].stats.untradedKills,
                hillTime: data[i].stats.hillTime,
                MatchKD: Number(data[i].stats.killDeathRatio)
            }
            Players.push(player)
        }
        return Players
    }

    function setGameData(data: any, homeTeam: TeamModel, awayTeam: TeamModel) {
        const game: GameData = {
            id: data.match.id,
            hostTeam: homeTeam,
            guestTeam: awayTeam,
            winnerId: data.result.winnerTeamId,
            loserId: data.result.loserTeamId
        }
        return game
    }

    //Write to excel
    async function writeData(data: any, gameId: number) {
        worksheet.columns = [
            { header: 'GameId', key: 'id', width: 10 },
            { header: 'Team', key: 'teamName', width: 20 },
            { header: 'Player', key: 'name', width: 20 },
            { header: 'Alias', key: 'alias', width: 20 },
            { header: 'Kills', key: 'kills', width: 10 },
            { header: 'Deaths', key: 'deaths', width: 10 },
            { header: 'Assists', key: 'assists', width: 10 },
            { header: 'NonTradedKills', key: 'nonTradeKills', width: 15 },
            { header: 'HillTime', key: 'hillTime', width: 10 },
            { header: 'MatchKD', key: 'MatchKD', width: 10 },
        ]
        data.forEach((game: GameModel) => {
            game.hostTeam.Players.forEach((player: PlayerModel) => {
                worksheet.addRow({
                    id: game.id,
                    teamName: game.hostTeam.teamName,
                    name: player.name,
                    alias: player.alias,
                    kills: player.kills,
                    deaths: player.deaths,
                    assists: player.assists,
                    nonTradeKills: player.nonTradeKills,
                    hillTime: player.hillTime,
                    MatchKD: player.MatchKD
                })
            })
            game.guestTeam.Players.forEach((player) => {
                worksheet.addRow({
                    id: game.id,
                    teamName: game.guestTeam.teamName,
                    name: player.name,
                    alias: player.alias,
                    kills: player.kills,
                    deaths: player.deaths,
                    assists: player.assists,
                    nonTradeKills: player.nonTradeKills,
                    hillTime: player.hillTime,
                    MatchKD: player.MatchKD
                })
            })
            worksheet.addRow({
                id: '',
                teamName: '',
                name: '',
                alias: '',
                kills: '',
                deaths: '',
                assists: '',
                nonTradeKills: '',
                hillTime: '',
                MatchKD: ''
             })
        })
        const exportPath = path.resolve(__dirname, '../data/gameStats.xlsx');
        await workbook.xlsx.writeFile(exportPath);
        
    }