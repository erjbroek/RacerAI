import Scene from "../scenes/Scene.js";
import StartingScene from "../scenes/StartingScene.js";
import HandleScore from "./HandleScore.js";
import HandleStats from "./HandleStats.js";

export interface Stats {
  launchPower: number;
  moveEnergy: number;
  luck: number;
  airResistance: number;
  fuelPower: number;
  fuel: number;
  coinMult: number;
  launchPowerTier: number;
  moveEnergyTier: number;
  luckTier: number;
  airResistanceTier: number;
  fuelPowerTier: number;
  fuelTier: number;
  coinMultTier: number;
  duckDollars: number;
  playTime: number;
  fPlayTime: number;
}

export default class Cookies {
  public static activeSlot: number = 0;

  /**
   * saves player stats
   *
   * @param slotNumber is the selected slot the stats should be saved to
   */
  public static saveStatsToCookies(slotNumber: number) {
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

  /**
   * saves player stats
   *
   * @param slotNumber is the selected slot the stats should be saved to
   */
  public static startSlot(slotNumber: number) {
    const stats = {
      launchPower: 1,
      moveEnergy: 1,
      luck: [0, 0],
      airResistance: 1,
      fuelPower: 1,
      fuel: 100,
      coinMult: 1,
      launchPowerTier: 0,
      moveEnergyTier: 0,
      luckTier: 0,
      airResistanceTier: 0,
      fuelPowerTier: 0,
      fuelTier: 0,
      coinMultTier: 0,
      duckDollars: 999999,
      playTime: 0,
      fPlayTime: '00:00.000',
    };

    const statsJson = JSON.stringify(stats);
    document.cookie = `slot${slotNumber}_stats=${statsJson}; expires=Fri, 31 Dec 9999 23:59:59 GMT`;
  }

  /**
   * Get stats from a specific slot
   * @param slotNumber The slot number to retrieve stats from
   * @returns The stats object from the specified slot, or null if not found
   */
  public static getStatsFromSlot(slotNumber: number): Stats | null {
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

  /**
   * Load player stats from a specific slot
   *
   * @param {number} slotNumber - The slot number to load stats from
   */
  public static loadStatsFromCookieSlot(slotNumber: number) {
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
      // Update HandleStats with the loaded stats
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

  /**
   * Check if a cookie exists for the given slot number
   *
   * @param {number} slotNumber - The slot number to check for
   * @returns {boolean} - True if a cookie exists for the slot, false otherwise
   */
  public static checkCookieForSlot(slotNumber: number): boolean {
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

  /**
   * @param slotNumber is the selected slotnumber to be deleted
   */
  public static removeCookie(slotNumber: number) {
    const cookieName = `slot${slotNumber}_stats`;
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }
}
