const tf = require('@tensorflow/tfjs-node-gpu');
const path = require('path');
const fs = require('fs');
const { createHash } = require('crypto');
const url = require('url');

const buildToInput = (build, level) => {
  const buildArr = build.split('');
  const input = [];
  for (let i = 0; i < 8; i++) {
    if (!input[i]) input[i] = [];
    for (let j = 0; j < 8; j++) {
      if (!input[i][j]) input[i][j] = [];
      for (let k = 0; k < 16; k++) {
        input[i][j][k] = k + 1 === level + 8 ? 1 : 0;
      }
    }
  }
  for (let index = 0; index < 64; index++) {
    const i = Math.floor(index / 8);
    const j = index % 8;
    const k = buildArr[index] > 0 ?
      buildArr[index] - 1 : 7;
    input[i][j][k] = 1;
  }
  return input;
};

const run = async () => {
  const dataDir = path.resolve(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
  }
  const keyPath = path.resolve(dataDir, 'key.txt');
  let key = '';
  
  if (!fs.existsSync(keyPath)) {
    key = new Array(64)
      .fill(undefined)
      .map(() => Math.floor(Math.random() * 8))
      .join('');
    fs.writeFileSync(
      keyPath,
      key,
      { encoding: 'utf8' }
    );
  } else {
    key = fs.readFileSync(keyPath, { encoding: 'utf8' });
  }
  
  const hashPath = path.resolve(dataDir, 'hash.txt');
  const hash = createHash('sha256').update(key).digest('hex').toUpperCase();
  fs.writeFileSync(
    hashPath,
    hash
  );

  const model = tf.sequential({
    layers: [
      tf.layers.conv2d({
        inputShape: [8, 8, 16],
        filters: 32,
        kernelSize: 3,
        activation: 'relu',
      }),
      tf.layers.conv2d({filters: 64, kernelSize: 3, activation: 'relu'}),
      tf.layers.conv2d({filters: 128, kernelSize: 3, activation: 'relu'}),
      tf.layers.flatten({}),
      tf.layers.dense({units: 256, activation: 'relu'}),
      tf.layers.dense({units: 1, activation: 'sigmoid'}),
    ],
  });

  model.compile({optimizer: tf.train.adam(0.001), loss: 'meanSquaredError'});
  for (let i = 1; i <= 10 ; i++) {
    const inputs = [];
    const outputs = [];
    while (inputs.length < 100) {
      const output = Math.random();
      const level = Math.ceil(Math.random() * 8);
      const inputArr = key
        .split('')
        .map(char => +char)
        .map(value => Math.random() > output ?
          level === 8 ?
            Math.floor(Math.random() * 8) :
            level :
          value
        );
      const inputText = inputArr.join('');
      if (inputText === key) {
        continue;
      }
      const input = buildToInput(inputText, level);
      inputs.push(input);
      outputs.push([output]);
    }
    const inputsTensor = tf.tensor(inputs);
    const outputsTensor = tf.tensor(outputs);

    const h = await model.fit(
      inputsTensor,
      outputsTensor,
      {
        batchSize: 32,
        epochs: 1,
        validationSplit: 0.1,
      }
    );
    inputsTensor.dispose();
    outputsTensor.dispose();

    console.log("Loss after Epoch " + i + " : " + h.history.loss[0]);
  }

  const modelDir = path.resolve(dataDir, 'model');
  const requestUrl = url.pathToFileURL(modelDir).href.replace(
    '///', 
    process.platform === 'win32' ? '//' : '///'
  ); // https://stackoverflow.com/questions/57859770
  await model.save(requestUrl);
};

run();
