import React, { useState } from "react";
import { IoSend } from "react-icons/io5";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "../redux/messageSlice";

const SendInput = () => {
  const [message, setMessage] = useState("");
  const [language, setLanguage] = useState("en"); // default English
  const [isTranslating, setIsTranslating] = useState(false);
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

  const translateText = async (text, targetLang) => {
    if (!text.trim()) return text;
    setIsTranslating(true);

    try {
      // Try LibreTranslate first (better CORS support)
      const libreRes = await axios.post(
        "https://libretranslate.de/translate",
        {
          q: text,
          source: "auto",
          target: targetLang,
          format: "text",
        },
        {
          timeout: 5000,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (libreRes.data?.translatedText) {
        return libreRes.data.translatedText;
      }
      throw new Error("LibreTranslate failed");
    } catch (libreError) {
      console.log("Primary translation failed, trying backup...");

      // Fallback to MyMemory with CORS proxy
      try {
        const proxyUrl = "https://cors-anywhere.herokuapp.com/";
        const memoryRes = await axios.get(
          `${proxyUrl}https://api.mymemory.translated.net/get?q=${encodeURIComponent(
            text
          )}&langpair=auto|${targetLang}`,
          { timeout: 5000 }
        );

        if (memoryRes.data?.responseData?.translatedText) {
          return memoryRes.data.responseData.translatedText;
        }
        throw new Error("MyMemory failed");
      } catch (memoryError) {
        console.log("All translation APIs failed, sending original text");
        return text;
      }
    } finally {
      setIsTranslating(false);
    }
  };

  const sendMessage = async (messageToSend) => {
    try {
      const res = await axios.post(
        `http://localhost:8080/api/v1/message/send/${selectedUser?._id}`,
        { message: messageToSend },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      dispatch(setMessages([...messages, res?.data?.newMessage]));
      setMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
      alert("Failed to send message. Please try again.");
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Always translate to selected language before sending
    const translatedText = await translateText(message, language);
    await sendMessage(translatedText);
  };

  return (
    <form onSubmit={onSubmitHandler} className="px-4 my-3">
      <div className="w-full relative">
        <div className="flex items-center gap-2">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="text-sm rounded-md bg-gray-700 text-white p-2 border border-zinc-500"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.label}
              </option>
            ))}
          </select>

          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            type="text"
            placeholder={`Type a message (will be sent in ${
              languages.find((l) => l.code === language)?.label
            })`}
            className="flex-1 border text-sm rounded-lg p-3 border-zinc-500 bg-gray-600 text-white"
          />

          <button
            type="submit"
            disabled={isTranslating}
            className={`text-white text-xl pr-2 ${
              isTranslating ? "opacity-50 cursor-not-allowed" : "opacity-100"
            }`}
          >
            <IoSend />
          </button>
        </div>

        {isTranslating && (
          <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            Translating to {languages.find((l) => l.code === language)?.label}
            ...
          </div>
        )}
      </div>
    </form>
  );
};

export default SendInput;
