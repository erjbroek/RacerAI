import HandleScore from "./HandleScore.js";
import HandleStats from "./HandleStats.js";
export default class Cookies {
    static activeSlot = 0;
    static saveStatsToCookies(slotNumber) {
        const stats = {
            launchPower: HandleStats.launchPower,
            moveEnergy: HandleStats.moveEnergy,
            luck: HandleStats.luck,
            airResistance: HandleStats.airResistance,
            fuelPower: HandleStats.fuelPower,
            fuel: HandleStats.fuel,
            coinMult: HandleStats.coinMult,
            launchPowerTier: HandleStats.launchPowerTier,
            moveEnergyTier: HandleStats.moveEnergyTier,
            luckTier: HandleStats.luckTier,
            airResistanceTier: HandleStats.airResistanceTier,
            fuelPowerTier: HandleStats.fuelPowerTier,
            fuelTier: HandleStats.fuelTier,
            coinMultTier: HandleStats.coinMultTier,
            duckDollars: HandleScore.duckDollars,
            playTime: HandleScore.playTime,
            fPlayTime: HandleScore.fPlayTime,
        };
        const statsJson = JSON.stringify(stats);
        document.cookie = `slot${slotNumber}_stats=${statsJson}; expires=Fri, 31 Dec 9999 23:59:59 GMT`;
    }
    static getStatsFromSlot(slotNumber) {
        const cookieName = `slot${slotNumber}_stats`;
        const cookies = document.cookie.split(";");
        let statsJson = "";
        cookies.forEach((cookie) => {
            const [name, value] = cookie.split("=");
            if (name.trim() === cookieName) {
                statsJson = value;
            }
        });
        if (statsJson) {
            const stats = JSON.parse(statsJson);
            return stats;
        }
        return null;
    }
    static loadStatsFromCookieSlot(slotNumber) {
        Cookies.activeSlot = slotNumber;
        const cookieName = `slot${slotNumber}_stats`;
        const cookies = document.cookie.split(";");
        let statsJson = "";
        cookies.forEach((cookie) => {
            console.log(cookie);
            const [name, value] = cookie.split("=");
            if (name.trim() === cookieName) {
                statsJson = value;
            }
        });
        if (statsJson) {
            const stats = JSON.parse(statsJson);
            HandleStats.launchPower = stats.launchPower;
            HandleStats.moveEnergy = stats.moveEnergy;
            HandleStats.luck = stats.luck;
            HandleStats.airResistance = stats.airResistance;
            HandleStats.fuelPower = stats.fuelPower;
            HandleStats.fuel = stats.fuel;
            HandleStats.coinMult = stats.coinMult;
            HandleStats.launchPowerTier = stats.launchPowerTier;
            HandleStats.moveEnergyTier = stats.moveEnergyTier;
            HandleStats.luckTier = stats.luckTier;
            HandleStats.airResistanceTier = stats.airResistanceTier;
            HandleStats.fuelPowerTier = stats.fuelPowerTier;
            HandleStats.fuelTier = stats.fuelTier;
            HandleStats.coinMultTier = stats.coinMultTier;
            HandleScore.duckDollars = stats.duckDollars;
            HandleScore.playTime = stats.playTime;
            HandleScore.fPlayTime = stats.fPlayTime;
        }
    }
    static checkCookieForSlot(slotNumber) {
        const cookieName = `slot${slotNumber}_stats`;
        const cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
            const [name, _] = cookies[i].split("=");
            if (name.trim() === cookieName) {
                return true;
            }
        }
        return false;
    }
    static removeCookie(slotNumber) {
        const cookieName = `slot${slotNumber}_stats`;
        console.log(cookieName);
        const cookies = document.cookie.split(";");
        console.log(cookies);
        for (let i = 0; i < cookies.length; i++) {
            const [name, _] = cookies[i].split("=");
            if (name.trim() === cookieName) {
                document.cookie = `${name.trim()}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
            }
        }
    }
}
//# sourceMappingURL=Cookies.js.map