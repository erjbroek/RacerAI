// import Coin from '../drawables/Coin.js';
// import HandleBackground from './HandleBackground.js';

// export default class HandleItems {
//   private items: (Coin)[];

//   private backgroundHandler: typeof HandleBackground;

//   public constructor(background: typeof HandleBackground) {
//     this.items = [];
//     this.backgroundHandler = background;
//   }

//   public move() {

//   }

//   public addItems() {
//     while (this.items.filter((obj) => obj instanceof Coin).length < 15) {
//       this.items.push(new Coin(
//         window.innerWidth + (
//           window.innerWidth + Math.random() * (window.innerWidth * 3)),
//         (this.backgrounds[0].getPosY() + this.backgrounds[0].getHeight()),
//       ));
//     }
//   }
// }
