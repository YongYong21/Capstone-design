import "./App.css";
import { useState } from "react";
const { Configuration, OpenAIApi } = require("openai");

function App() {
  const [input, setInput] = useState("");
  const [send, setSend] = useState("");
  const [chat, setChat] = useState(["안녕하세요"]);
  const [output, setOutput] = useState("");
  const configuration = new Configuration({
    apiKey: "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",
  });
  const openai = new OpenAIApi(configuration);

  const handleSendClick = () => {
    setSend(input);

    let copyUser = [...chat];
    copyUser.push(input);
    setChat(copyUser);

    openai
      .createCompletion({
        model: "text-davinci-003",
        prompt: input,
        temperature: 0.7,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      })
      .then((result) => {
        let copy = [...chat];
        copy.push(result.data.choices[0].text);
        setChat(copy);
      });
      
  };

  return (
    <div className="App">
      <div className="chatContainer">
        {chat.map((item, index) => {
          return (
            <div className="chatBox" key={index}>
              <span className={`chatMsg ${index % 2 === 1 ? "user" : ""}`}>
                {item}
              </span>
            </div>
          );
        })}
      </div>

      <input
        className="chatMsg"
        onChange={(e) => {
          setInput(e.target.value);
        }}
      />

      <button onClick={handleSendClick}>보내기</button>
    </div>
  );
}

export default App;
