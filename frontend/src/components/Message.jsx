import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

const Message = ({ message }) => {
  const scroll = useRef();
  const { authUser, selectedUser } = useSelector((store) => store.user);

  useEffect(() => {
    scroll.current.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  const isSender = message?.senderId === authUser?._id;

  return (
    <div
      ref={scroll}
      className={`chat ${isSender ? "chat-end" : "chat-start"}`}
    >
           {" "}
      <div className="chat-image avatar">
               {" "}
        <div className="w-10 rounded-full">
                   {" "}
          <img
            alt="user"
            src={isSender ? authUser?.profilePhoto : selectedUser?.profilePhoto}
          />
                 {" "}
        </div>
             {" "}
      </div>
           {" "}
      <div className="chat-header">
               {" "}
        <time className="text-xs opacity-50 text-white">
                   {" "}
          {new Date(message?.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
                 {" "}
        </time>
             {" "}
      </div>
           {" "}
      <div className="chat-bubble bg-blue-600 text-white">
               {" "}
        <p className="text-xs italic text-gray-300 mb-1">
                    Original: {message?.original}       {" "}
        </p>
               {" "}
        <p className="text-sm font-medium">
                    {message?.translated}       {" "}
        </p>
             {" "}
      </div>
         {" "}
    </div>
  );
};

export default Message;
