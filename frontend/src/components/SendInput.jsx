import React, { useState } from "react";
import { IoSend } from "react-icons/io5";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "../redux/messageSlice";

const SendInput = () => {
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const { selectedUser } = useSelector((store) => store.user);
  const { messages } = useSelector((store) => store.message);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      const sourceLang = "en"; // Can be dynamically set based on user later
      const targetLang = selectedUser?.language || "en";

      let translatedMessage = message; // If language different, translate using LibreTranslate API

      if (sourceLang !== targetLang) {
        const response = await axios.post(
          "https://libretranslate.de/translate",
          {
            q: message,
            source: sourceLang,
            target: targetLang,
            format: "text",
          },
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        translatedMessage = response?.data?.translatedText || message;
      } // Send original and translated to backend

      const res = await axios.post(
        `http://localhost:8080/api/v1/message/send/${selectedUser?._id}`,
        {
          original: message,
          translated: translatedMessage,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      dispatch(setMessages([...messages, res?.data?.newMessage]));
    } catch (error) {
      console.error("Error while sending message:", error);
    }

    setMessage("");
  };

  return (
    <form onSubmit={onSubmitHandler} className="px-4 my-3">
           {" "}
      <div className="w-full relative">
               {" "}
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          type="text"
          placeholder="Send a message..."
          className="border text-sm rounded-lg block w-full p-3 border-zinc-500 bg-gray-600 text-white"
        />
               {" "}
        <button
          type="submit"
          className="absolute flex inset-y-0 end-0 items-center pr-4"
        >
                    <IoSend />       {" "}
        </button>
             {" "}
      </div>
         {" "}
    </form>
  );
};

export default SendInput;
