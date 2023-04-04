const tf = require("@tensorflow/tfjs-node");
const transformers = require("transformers");

async function generateText(inputText) {
  // GPT-2 모델 로드
  const model = await transformers.TFAutoModelForCausalLM.fromPretrained("gpt2");

  // 토큰화 함수
  const tokenizer = await transformers.AutoTokenizer.fromPretrained("gpt2");

  // 입력 텍스트를 토큰으로 변환
  const inputTokens = tokenizer.encode(inputText);

  // 텐서로 변환
  const inputTensor = tf.tensor([inputTokens]);

  // 샘플링 예측 수행
  const outputTensor = await model.generate(inputTensor, { max_length: 100 });

  // 출력 토큰을 텍스트로 디코딩
  const outputText = tokenizer.decode(outputTensor.arraySync()[0]);

  console.log(`입력: ${inputText}`);
  console.log(`출력: ${outputText}`);
}

generateText("안녕하세요, 오늘 날씨가 좋네요!");
