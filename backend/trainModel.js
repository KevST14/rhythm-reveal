const tf = require("@tensorflow/tfjs-node");
const fs = require("fs");

// Simulated dataset: track features (tempo, energy, danceability) → user preference (like/dislike)
const dataset = [
  { input: [120, 0.8, 0.9], output: [1] },  // Liked song
  { input: [140, 0.7, 0.6], output: [1] },  // Liked song
  { input: [100, 0.3, 0.4], output: [0] },  // Disliked song
  { input: [130, 0.9, 0.8], output: [1] },  // Liked song
  { input: [110, 0.5, 0.5], output: [0] }   // Disliked song
];

// Convert dataset to tensors
const xs = tf.tensor2d(dataset.map(d => d.input));
const ys = tf.tensor2d(dataset.map(d => d.output));

// Define a neural network model
const model = tf.sequential();
model.add(tf.layers.dense({ inputShape: [3], units: 10, activation: "relu" }));
model.add(tf.layers.dense({ units: 1, activation: "sigmoid" }));

// Compile model
model.compile({
  optimizer: "adam",
  loss: "binaryCrossentropy",
  metrics: ["accuracy"],
});

// Train model
async function train() {
  await model.fit(xs, ys, {
    epochs: 50,
    shuffle: true,
  });
  
  // Save the model
  await model.save("file://./ai-model");
  console.log("Model trained and saved!");
}

train();
