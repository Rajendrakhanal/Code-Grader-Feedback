import React from "react";

interface GradeWindowProps {
  grade?: string; // Optional grade prop
}

const GradeWindow: React.FC<GradeWindowProps> = ({ grade }) => {
  return (
    <div className="w-full flex flex-col items-start space-y-2 h-1/6">
      <h1 className="py-3 text-gray-50 text-2xl underline underline-offset-4 border-gray-50 rounded-md text-center">
        Grade
      </h1>
      <div className="w-full h-[38vh] bg-[#1E1E1E] rounded-md text-gray-300 font-normal overflow-y-auto border-2 border-gray-50 p-4">
        {grade ? grade : <p>Your grade will appear here</p>}
      </div>
    </div>
  );
};

export default GradeWindow;
