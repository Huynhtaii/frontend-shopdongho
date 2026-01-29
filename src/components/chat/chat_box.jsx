import { useState } from "react";
import { RiSendPlaneFill, RiImageAddLine } from "react-icons/ri";

const ChatBox = ({ selectedUser }) => {
  const [message, setMessage] = useState("");

  // Data mẫu - sau này sẽ lấy từ API
  const messages = [
    {
      id: 1,
      sender: "user",
      message: "Xin chào shop",
      time: "10:00",
    },
    {
      id: 2,
      sender: "admin",
      message: "Chào bạn, mình có thể giúp gì cho bạn?",
      time: "10:01",
    },
    {
      id: 3,
      sender: "user",
      message: "Mình muốn hỏi về sản phẩm đồng hồ Casio",
      time: "10:02",
    },
    // Thêm tin nhắn khác...
  ];

  const handleSend = () => {
    if (message.trim()) {
      // Xử lý gửi tin nhắn
      console.log("Sending:", message);
      setMessage("");
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b flex items-center gap-3">
        <img
          src={selectedUser.avatar}
          alt={selectedUser.name}
          className="w-10 h-10 rounded-full"
        />
        <div>
          <h3 className="font-medium">{selectedUser.name}</h3>
          <span className="text-sm text-gray-500">
            {selectedUser.online ? "Đang hoạt động" : "Không hoạt động"}
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender === "admin" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                msg.sender === "admin"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100"
              }`}
            >
              <p>{msg.message}</p>
              <span className="text-xs text-gray-500 mt-1 block">
                {msg.time}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <RiImageAddLine size={20} className="text-gray-500" />
          </button>
          <input
            type="text"
            placeholder="Nhập tin nhắn..."
            className="flex-1 p-2 border rounded-full focus:outline-none focus:border-blue-500"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
            onClick={handleSend}
          >
            <RiSendPlaneFill size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
