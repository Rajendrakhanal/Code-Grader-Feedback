import React from "react";

interface FeedBackWindowProps {
  feedback?: string; // Optional feedback prop
}

const FeedBackWindow: React.FC<FeedBackWindowProps> = ({ feedback }) => {
  return (
    <div className="w-full flex flex-col items-start space-y-2 h-2/5">
      <h1 className="py-3 text-gray-50 text-2xl underline underline-offset-4 border-gray-50 rounded-md text-center">
        Feedback
      </h1>
      <div className="w-full h-[38vh] bg-[#1E1E1E] rounded-md text-gray-300 font-normal overflow-y-auto border-2 border-gray-50 p-4">
        {feedback ? feedback : <p>Your feedback will appear here</p>}
      </div>
    </div>
  );
};

export default FeedBackWindow;
