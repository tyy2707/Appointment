import { useState, useEffect } from "react";
import "./chatGpt.css";
import axios from "axios";
import { Close } from "@mui/icons-material";
import { Button } from "@mui/material";
import { Textarea } from "@nextui-org/react";

const apiKEy = 'sk-proj-Zz62Vj3mLm5IxX7z5mRHT3BlbkFJ05ZYgVOXO8sSukcZ4Q7v'


function ChatGpt(props) {
  const { handleClose } = props;
  const [inputValue, setInputValue] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const WelcomMes = "Chào bạn, tôi là trợ lý ảo, tôi có thể giúp gì cho bạn ?";

  useEffect(() => {
    setChatLog([{ type: "bot", message: WelcomMes }]);
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!inputValue.trim()) return;

    setChatLog((prevChatLog) => [
      ...prevChatLog,
      { type: "user", message: inputValue },
    ]);

    sendMessage(inputValue);
    setInputValue("");
  };
  const sendMessage = (message) => {
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKEy}`
    };

    const url = "https://api.openai.com/v1/chat/completions";

    const data = {
      "model": "gpt-3.5-turbo",
      "temperature": 0.7,
      "messages": [{ role: "user", content: message }],
    };
    setIsLoading(true);
    axios
      .post(url, data, { headers: headers })
      .then((response) => {
        setChatLog((prevChatLog) => [
          ...prevChatLog,
          { type: "bot", message: response.data.choices[0].message.content },
        ]);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        console.log(error);
      });
  };

  return (
    <div className="container-ChatGPT shadow-2xl fade-in">
      <h1 className="bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text text-left pading-left-1 font-bold">
        <div className="flex flex-row justify-between items-center">
          <div>
            <h4 className="text-[#fff] font-bold text-xl" style={{ paddingLeft: "20px" }}>MedproGPT</h4>
            <h2 className="text-gray-light text-sm" style={{ paddingLeft: "20px" }}>Hỏi đáp thắc mắc về sức khỏe</h2>
          </div>
          <Button onClick={handleClose}>
            <Close className="relative text-[#fff]" />
          </Button>
        </div>
      </h1>
      <div className="container-chat">
        <div className="message">
          <div className="flex flex-col space-y-1">
            <div className="message-box-chat">
              {chatLog.map((message, index) => (
                <div
                  key={index}
                  className={` ${message.type === "user" ? "message-user" : "message-bot"
                    }`}
                >
                  <div className="rounded-lg p-2 text-gray max-w-sm">
                    <div
                      className="message-i"
                      style={{
                        background: message.type === "user"
                          ? "rgba(96, 168, 250, 0.25)"
                          : "rgba(255, 199, 0, 0.25)",
                      }}
                    >
                      {message.message}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div key={chatLog.length} className="flex justify-start">
                  <div className="rounded-lg p-4 text-black max-w-sm">
                    ...
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <form className="shadow-md w-full flex justify-between items-center flex-row" style={{ borderTop: "1px solid #00b5f1 " }} onSubmit={handleSubmit}>
          <div className="w-full border-t-1 border-t-blue">
            <Textarea
              type="text"
              style={{ borderRight: '#00b5f1', height: 40, borderRadius: 0, outline: "none" }}
              placeholder="Type your message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>
          <Button
            variant="outlined"
            type="submit"
            className="w-1/5 h-full"
            style={{ background: "transparent", border: "none" }}
          >
            <i className="fa-sharp fa-solid fa-paper-plane"></i>
          </Button>
        </form>
      </div>
    </div>
  );
}

export default ChatGpt;
