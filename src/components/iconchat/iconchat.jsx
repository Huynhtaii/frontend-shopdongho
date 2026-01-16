import React, { useState } from "react";
import { IoCloseCircle } from "react-icons/io5";

const IconChat = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div>
      <div className="flex flex-col items-end gap-2 justify-center relative">
        {/* Chat box */}
        {isOpen ? (
          <div className="relative flex items-center justify-between bg-yellow-400 rounded-md p-2">
            <h1 className="text-white">Chat với chúng tôi</h1>
            <button
              className="absolute bottom-[90%] left-[100%]"
              onClick={() => setIsOpen(false)}
            >
              <IoCloseCircle />
            </button>
            <div
              className="absolute -translate-x-1/2 top-[98%] left-[85%] w-0 h-0
               border-l-[10px] border-l-transparent 
                border-r-[10px] border-r-transparent 
                border-t-[10px] border-t-yellow-400"
            ></div>
          </div>
        ) : null}

        {/* Icon chat */}
        <div className="w-[50px] h-[50px] bg-white rounded-full flex items-center justify-center">
          <img src="/mess.png" alt="" className="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  );
};

export default IconChat;
