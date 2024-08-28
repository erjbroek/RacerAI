
# RacerAI   ![Static Badge](https://img.shields.io/badge/npm-v9.6.7-blue) ![GitHub last commit](https://img.shields.io/github/last-commit/erjbroek/RacerAI)




RacerAI is a game where AI-driven cars learn to race on user-designed tracks through evolving machine learning algorithms.


<br>
This project that merges playing games with machine learning, allowing users to design their own racing tracks and watch as AI-driven cars learn to navigate them more effectively over time. The project uses genetic algorithms and simple neural networks, to evolve the cars' behavior and improve their racing strategies. The appearance of the cars even adapts as they evolve, providing a visual representation of their learning process.
<br><br>
<img src="https://github.com/user-attachments/assets/8b29f704-2620-4b5e-80ac-5cb35ef20afa" width=800></img>

<br><br>
## Features

- **Track Drawer**: Design and customize your own racing tracks, making it possible to make the race however you want. From loops to a track in the shape of a duck, it's all possible.

<br>
 


-   **Genetic Algorithm**: Inspired by natural selection, evolve a list of instructions the cars use over generations, gradually improving racing skills and distance. Since performance per car is really light, the game can handle thousands of cars at once. Although this might not find the fastest time, it will find the shortest path.
  
<img src="https://github.com/erjbroek/RacerAI/assets/112830052/e571b5d3-8fdf-4735-b5e9-75f8536efd34" width=500></img>
<img src="https://github.com/erjbroek/RacerAI/assets/112830052/f65f07c4-0cf4-4df0-a922-a8717ab410a0" width=500></img>

<br><br><br><br><br>
  - **Genetic algorithm using neural network**: Here, each car has a neural network that mutates and becomes better over time. 
    When the brain (neural network) of the cars evolve, the appearance will also change. When cars look similar, their strategies will also be similar. This makes for alot of different combinations of cars that race around the track at the same time.
    <br>
    <img src="https://github.com/user-attachments/assets/84286750-ef33-4035-afaf-76aabd26c723" width=400></img>
    <img src="https://github.com/user-attachments/assets/64959bb4-71c1-41ba-b536-f1469cdd2022" width=400></img>
    <img src="https://github.com/user-attachments/assets/7fc4873f-1703-4386-a128-f90532dff8c1" width=800></img>
    <br><br><br><br>

    - **Extra customization**: You can play around with a lot of different settings. You can change variables like mutation rate or the number of cars in each generation. These options allow to experiment and see how those have an impact the settings have on performance and evolution of the cars across generations
<br>

![settings & statistics](https://github.com/user-attachments/assets/6cf85d22-20d4-42fb-94a1-5f1baf32bba1)
<br><br><br>


## Installation

<br>

For a simple demo of the game, you are able to visit [Github Pages](https://erjbroek.github.io/RacerAI/)
<br><br><br>

### Follow these steps to set up and run the project locally.


### 1. Clone the Repository

First, clone the repository to your local machine:

```bash
git clone https://github.com/erjbroek/RacerAI.git
```

### 2. Navigate to the Project Directory

Change into the project directory:

```bash
cd RacerAI
```

### 3. Install Dependencies

Install the required dependencies using npm:

```bash
npm install
```


### 4. Build the Project

Compile the TypeScript code into JavaScript:

```bash
npm run build
```
This command runs the TypeScript compiler (`tsc`), which compiles the `.ts` files into `.js` files in the "build" directory.<<br><br>
 
```bash
npm run watch
```

This command keeps the TypeScript compiler running in watch mode, so it will automatically recompile your code whenever you make changes. This is easier to use while actively developing so you can keep better track of the changes made.

### 5. Run the Game


To open the game in the default web browser, you can use the [Live server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension for visual studio code (or your own alternative).


