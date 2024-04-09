import Scene from '../scenes/Scene.js';
import StartingScene from '../scenes/StartingScene.js';
import HandleScore from './HandleScore.js';
import HandleStats from './HandleStats.js';

export default class Cookies {
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
    };

    const statsJson = JSON.stringify(stats);
    document.cookie = `slot${slotNumber}_stats=${statsJson}; expires=Fri, 31 Dec 9999 23:59:59 GMT`;
  }

  /**
   * Load player stats from a specific slot
   *
   * @param {number} slotNumber - The slot number to load stats from
   */
  public static loadStatsFromCookieSlot(slotNumber: number) {
    const cookieName = `slot${slotNumber}_stats`;
    const cookies = document.cookie.split(';');
    let statsJson = '';

    cookies.forEach((cookie) => {
      console.log(cookie)
      const [name, value] = cookie.split('=');
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
    }
  }

  /**
   * resets cookies
   */
  public static removeAllCookies(): Scene {
    const cookies = document.cookie.split(";");

    cookies.forEach((cookie) => {
      const [name, _] = cookie.split("=");
      // Remove the cookie by setting its expiration to a past date
      document.cookie = `${name.trim()}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    });
    return new StartingScene();
  }
}
