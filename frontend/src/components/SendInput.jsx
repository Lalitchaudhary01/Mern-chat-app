import React, { useState } from "react";
import { IoSend } from "react-icons/io5";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "../redux/messageSlice";

const SendInput = () => {
  const [message, setMessage] = useState("");
  const [language, setLanguage] = useState("en"); // default English
  const dispatch = useDispatch();
  const { selectedUser } = useSelector((store) => store.user);
  const { messages } = useSelector((store) => store.message);

  const languages = [
    { code: "en", label: "English" },
    { code: "hi", label: "Hindi" },
    { code: "es", label: "Spanish" },
    { code: "fr", label: "French" },
    { code: "de", label: "German" },
  ];

  const translateMessage = async (text, toLang) => {
    try {
      const res = await axios.post("https://libretranslate.de/translate", {
        q: text,
        source: "auto",
        target: toLang,
        format: "text",
      });
      return res.data.translatedText;
    } catch (err) {
      console.error("Translation failed:", err);
      return text;
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      const translated = await translateMessage(message, language);
      const res = await axios.post(
        `http://localhost:8080/api/v1/message/send/${selectedUser?._id}`,
        { message: translated },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      dispatch(setMessages([...messages, res?.data?.newMessage]));
    } catch (error) {
      console.log(error);
    }
    setMessage("");
  };

  return (
    <form onSubmit={onSubmitHandler} className="px-4 my-3">
           {" "}
      <div className="w-full relative flex items-center gap-2">
                {/* Language Dropdown */}       {" "}
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="text-sm rounded-md bg-gray-700 text-white p-2 border border-zinc-500"
        >
                   {" "}
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
                            {lang.label}           {" "}
            </option>
          ))}
                 {" "}
        </select>
                {/* Message Input */}
               {" "}
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          type="text"
          placeholder="Send a message..."
          className="flex-1 border text-sm rounded-lg p-3 border-zinc-500 bg-gray-600 text-white"
        />
                {/* Send Button */}       {" "}
        <button type="submit" className="text-white text-xl pr-2">
                    <IoSend />       {" "}
        </button>
             {" "}
      </div>
         {" "}
    </form>
  );
};

export default SendInput;
