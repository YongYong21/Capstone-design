import "./App.css";
import { useState, useEffect, useRef } from "react";
import { Configuration, OpenAIApi } from "openai";
// const { Configuration, OpenAIApi } = require("openai");

function App() {
  const [input, setInput] = useState("");
  const [reRender, setReRender] = useState("");
  const [chat, setChat] = useState(["안녕하세요"]);
  const [output, setOutput] = useState("");
  const configuration = new Configuration({
    apiKey: "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",
  });
  const openai = new OpenAIApi(configuration);
  

  
  const handleSendClick = () => {
    
    let copy = [...chat];
    copy.push(input);
    setChat(copy);
    
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
        copy=[...copy];
        copy.push(result.data.choices[0].text);
        setChat(copy);
        // let copyreRender = [...reRender];
        // copyreRender = [''];
        // setReRender(copyreRender);
        // copyreRender.pop();
      });
      
  };

  // useEffect(() => { // chat의 내용을 재랜더링을 하기위해 만든 useEffect()
  //   let copy = [...chat]
  //   setChat(copy);
  // }, [reRender]); 

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
      <button onClick={()=>{
        console.log(chat);
      }}>로그확인용</button>
    </div>
  );
}

export default App;
