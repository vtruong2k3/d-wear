import React from "react";

const Contact: React.FC = () => {
  return (
    <div className="bg-white min-h-screen py-10 px-6 flex justify-center">
      <div className="max-w-3xl w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Liên hệ với D-Wear
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Nếu bạn có bất kỳ câu hỏi hoặc yêu cầu nào, hãy để lại thông tin bên
          dưới. Chúng tôi sẽ phản hồi trong thời gian sớm nhất.
        </p>

        <form className="bg-gray-50 shadow-md rounded-lg p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Họ và tên
            </label>
            <input
              type="text"
              placeholder="Nhập họ và tên của bạn"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="Nhập email của bạn"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tin nhắn
            </label>
            <textarea
              rows={5}
              placeholder="Nhập nội dung tin nhắn..."
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-400"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full !bg-gray-800 !text-white font-semibold py-3 rounded-lg hover:!bg-gray-700 transition duration-200 active:scale-95"
          >
            Gửi tin nhắn
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
