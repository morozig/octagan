# OctaGAN

*Save Princess Attention From 8 Discriminators*

![banner](/src/public/banner.png)

Play in your browser [here](https://morozig.github.io/octagan/)

## Combat Mechanics
- **Player Damage** = 1..20 + *Bonus*
- **Player Damage Block** = *Bonus*
- **Enemy Damage** = *l*..20 * *l*
- *Bonus* = round(*S<sub>l</sub>* * 20 * *l*)
- *l* = 1..8 - current level
- *S<sub>l</sub>* = 0..1 - current similarity(read details below)

## Machine Learming

![graph](/ml/graph.svg)

This game uses a tiny neural network to determine a player's combat
characteristics. The network acts as a discriminator and outputs numbers
between 0 and 1 while the player is trying to find the perfect build as
a generator. Despite the name this network is not trained like traditional
[Generative Adversarial Networks](https://arxiv.org/abs/1406.2661)
because it uses only a single "key" image as data source and rather
predicts noisiness of input compared to the key image.

**Training procedure**

1. Randomly generate or manually draw a key 8x8 image of 8 colors
2. Save the key image and its hash to external files
3. To generate a training point pick random `S = 0..1`(similarity, label)
and `l = 1..8`(level). With probability `1 - S` replace each pixel of the key image with `l`(`l = 1..7`) or random color(`l = 8`). 
Check that the resulting image is different from the key
4. Run training for 10 epochs of 100000 new samples
5. Test trained model on the key image and on empty build(all zeros)
6. After training the key image file may be deleted

I've run this procedure only once and was surprised how well it worked with
low training and test errors. After some testing I've intentionally deleted
the key file without ever seeing it but it remains encoded into model weights
and here are its characteristics:

| Stat | Value |
| --- | --- |
|SHA-256|0AD03041A05120CA2C8A8C843EA3228EE83AD49B11CDD74F119A605DD2502CB8|
|Score|96.9%|

So to find the exact key build you would need a time machine or a quantum computer, though it is not required to beat the game, any image with a good 
enough score will do.

## About This Repo

I wanted to learn Vue.js after years of React experience by making some small 
project with it. It wouldn't be fun to do another shopping cart page so I 
decided to write a browser game and just mashed together things I like: ML, 
RPG, Sci-fi. Also I chose all the latest tools available at the moment: Nuxt 3 
(Beta), Vue 3, TypeScript, TSX, TensorFlow.js. I had a great time making this 
game but most of all I was amazed at how good Vue 3 has become. I think 
composables behave a lot more predictable compared to React hooks, especially 
I liked `watch`. The only thing I found baffling for a React developer was 
inability to fully define props types with interface. I hope it will be 
implemented some day, but now I understand why people love Vue so much and I 
can see myself using it for future projects.
