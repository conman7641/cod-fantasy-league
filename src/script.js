"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var Excel = require('exceljs');
var path = require("path");
var url = 'https://cdl-other-services.abe-arsfutura.com/production/v2/content-types/match-detail/bltd79e337aca601012?locale=en-us&options=%7B%22id%22%3A8760%7D';
function getData(url) {
    return __awaiter(this, void 0, void 0, function () {
        var data, json;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch(url, {
                        headers: {
                            'x-origin': 'callofdutyleague.com',
                        }
                    })];
                case 1:
                    data = _a.sent();
                    return [4 /*yield*/, data.json()];
                case 2:
                    json = _a.sent();
                    return [2 /*return*/, json];
            }
        });
    });
}
var data = getData(url).then(function (data) {
    var homeTeam = setTeamData(data.data.matchData.matchExtended.homeTeamCard); //get home team
    var homePlayers = setPlayerData(data.data.matchData.matchStats.overall.hostTeam); //get home players
    var awayTeam = setTeamData(data.data.matchData.matchExtended.awayTeamCard); //get away team
    var awayPlayers = setPlayerData(data.data.matchData.matchStats.overall.guestTeam); //get away players
    homeTeam.Players = homePlayers;
    awayTeam.Players = awayPlayers;
    var game = setGameData(data.data.matchData.matchExtended, homeTeam, awayTeam);
    writeData([game]);
});
function setTeamData(data) {
    var team = {
        id: data.id,
        teamName: data.name,
        abbreviation: data.abbreviation,
        Players: []
    };
    return team;
}
function setPlayerData(data) {
    //Home Team
    var Players = [];
    for (var i = 0; i < data.length; i++) {
        var player = {
            id: data[i].id,
            name: data[i].firstName + ' ' + data[i].lastName,
            alias: data[i].alias,
            kills: data[i].stats.totalKills,
            deaths: data[i].stats.totalDeaths,
            assists: data[i].stats.totalAssists,
            nonTradeKills: data[i].stats.untradedKills,
            hillTime: data[i].stats.hillTime,
            MatchKD: Number(data[i].stats.killDeathRatio)
        };
        Players.push(player);
    }
    return Players;
}
function setGameData(data, homeTeam, awayTeam) {
    var game = {
        id: data.match.id,
        hostTeam: homeTeam,
        guestTeam: awayTeam,
        winnerId: data.result.winnerTeamId,
        loserId: data.result.loserTeamId
    };
    return game;
}
//Write to excel
function writeData(data) {
    return __awaiter(this, void 0, void 0, function () {
        var workbook, worksheet, exportPath;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    workbook = new Excel.Workbook();
                    worksheet = workbook.addWorksheet('My Sheet');
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
                    ];
                    data.forEach(function (game) {
                        game.hostTeam.Players.forEach(function (player) {
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
                            });
                        });
                        game.guestTeam.Players.forEach(function (player) {
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
                            });
                        });
                    });
                    exportPath = path.resolve(__dirname, 'countries.xlsx');
                    return [4 /*yield*/, workbook.xlsx.writeFile(exportPath)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
