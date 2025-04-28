import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

const Message = ({ message }) => {
  const scroll = useRef();
  const { authUser, selectedUser } = useSelector((store) => store.user);

  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  const isSender = message?.senderId === authUser?._id;
  const hasOriginal =
    message?.original && message?.original !== message?.translated;

  return (
    <div
      ref={scroll}
      className={`flex ${isSender ? "justify-end" : "justify-start"} mb-2 px-2`}
    >
      <div
        className={`flex items-end ${
          isSender ? "flex-row" : "flex-row-reverse"
        } max-w-[70%]`}
      >
        {!isSender && (
          <img
            alt="user"
            className="w-8 h-8 rounded-full mr-2"
            src={selectedUser?.profilePhoto}
          />
        )}

        <div
          className={`rounded-lg py-2 px-3 ${
            isSender
              ? "bg-green-600 rounded-tr-none text-white"
              : "bg-gray-700 rounded-tl-none text-white"
          }`}
        >
          {hasOriginal && (
            <p className="text-xs italic text-gray-200 mb-1">
              {message?.original}
            </p>
          )}
          <p className="text-white text-sm">
            {message?.translated || message?.message || message?.original}
          </p>

          <div className="flex justify-end items-center mt-1 gap-1">
            <span className="text-xs text-gray-200">
              {new Date(message?.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            {isSender && (
              <svg
                className="w-3 h-3 text-gray-200"
                viewBox="0 0 16 16"
                fill="currentColor"
              >
                <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
              </svg>
            )}
          </div>
        </div>

        {isSender && (
          <img
            alt="user"
            className="w-8 h-8 rounded-full ml-2"
            src={authUser?.profilePhoto}
          />
        )}
      </div>
    </div>
  );
};

export default Message;
