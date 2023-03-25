import * as tf from '@tensorflow/tfjs';
import * as gpt3 from '@tensorflow-models/gpt-3';

async function loadModel() {
  const model = await gpt3.load({
    modelUrl: 'https://tfhub.dev/openai-gpt/1',
    tokenizerUrl: 'https://cdn.jsdelivr.net/npm/@tensorflow-models/gpt-3/wordpiece/',
  });

  // 모델 사용 예시
  const prompt = 'The quick brown fox';
  const length = 10;
  const temperature = 0.5;
  const response = await model.generateText(prompt, length, {temperature});

  console.log(response);
}

loadModel();