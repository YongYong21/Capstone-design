const tf = require('@tensorflow/tfjs-node');
const tfn = require('@tensorflow/tfjs-node-gpu');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const {promisify} = require('util');
const stream = require('stream');
const pipeline = promisify(stream.pipeline);
const {TextEncoder} = require('util');
const {GPT2} = require('gpt2-tfjs');
const {GPT2Tokenizer} = require('gpt2-toolkit');

// 데이터 로드
async function loadText(path) {
    const file =  fs.promises.readFile(path);
    return file.toString();
  }
  
  const text =  loadText('./data/corpus.txt');

  
// 학습 데이터셋 설정
const dataset = [
  'Hello, how are you?',
  'I am doing great. How about you?',
  'I am also doing well. Thanks for asking.'
];

// GPT 모델 초기화
const modelConfig = {
  vocabSize: 50257,
  layerCount: 12,
  headCount: 12,
  hiddenSize: 768
};
const gpt2Model = new GPT2(modelConfig);

// fine-tune을 위한 데이터 전처리 함수 정의
function preprocessData(dataset) {
  // 데이터셋을 문자열로 변환하고, 전처리 작업 수행
  const text = dataset.join('\n');
  const tokens = text.split(/\s+/g);
  const inputSeq = tokens.slice(0, -1).join(' <sep> ');
  const targetSeq = tokens.slice(1).join(' <sep> ');
  return { inputSeq, targetSeq };
}
// 모델 로드
const model =  GPT2.loadFromJson('./model/model.json', './model/weights.bin');

// 토크나이저 로드
const tokenizer =  GPT2Tokenizer.fromPretrained('gpt2');

// 전처리 함수
function preprocess(text) {
    // 텍스트를 토큰화하여 숫자로 변환
    const tokenized = tokenizer.encode(text);
    // 학습 데이터로 사용할 input과 target 데이터 생성
    const input = tokenized.slice(0, -1);
    const target = tokenized.slice(1);
    // input과 target을 Tensor로 변환
    const inputTensor = tf.tensor2d([input], [1, input.length], 'int32');
    const targetTensor = tf.tensor2d([target], [1, target.length], 'int32');
    return {input: inputTensor, target: targetTensor};
  }
  
  // 모델 학습
  async function train(text, model, tokenizer) {
    // 데이터 전처리
    const preprocessed = preprocess(text);
  
    // 학습 파라미터 설정
    const batchSize = 1;
    const epochs = 10;
    const learningRate = 1e-3;
    const optimizer = tf.train.adam(learningRate);
  
    // 모델 컴파일
    model.compile({optimizer: optimizer, loss: 'sparseCategoricalCrossentropy'});
  
    // 모델 학습
    for (let i = 0; i < epochs; i++) {
      console.log(`Epoch ${i + 1} of ${epochs}`);
       model.fit(preprocessed.input, preprocessed.target, {
        batchSize: batchSize,
        epochs: 1,
        shuffle: true,
        callbacks: {
          onEpochEnd: async (epoch, logs) => {
            console.log(`Loss: ${logs.loss}`);
          }
        }
      });
    }
  }
  
  // 모델 학습 시작
   train(text, model, tokenizer);

  // 모델 저장
 model.save('fine-tuned-model');
