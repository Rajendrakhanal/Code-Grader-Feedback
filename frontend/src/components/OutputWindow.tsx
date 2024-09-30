import React from "react";
import { OutputDetails } from "../types/types";

interface OutputWindowProps {
  outputDetails: OutputDetails | null;
}

// Function to escape HTML content
const escapeHtml = (unsafe: string) => {
  return unsafe
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
};

const OutputWindow: React.FC<OutputWindowProps> = ({ outputDetails }) => {
  const getOutput = () => {
    const statusId = outputDetails?.status?.id;

    if (statusId === 6) {
      // Compilation error
      return (
        <pre className="px-2 py-1 font-normal text-md text-red-500">
          {outputDetails?.compile_output
            ? escapeHtml(atob(outputDetails.compile_output))
            : "No compile output"}
        </pre>
      );
    } else if (statusId === 3) {
      // Successful execution
      return (
        <pre className="px-2 py-1 font-normal text-md text-green-500">
          {outputDetails?.stdout
            ? escapeHtml(atob(outputDetails.stdout))
            : "No output"}
        </pre>
      );
    } else if (statusId === 5) {
      // Time limit exceeded
      return (
        <pre className="px-2 py-1 font-normal text-md text-red-500">
          {`Time Limit Exceeded`}
        </pre>
      );
    } else {
      // Other errors
      return (
        <pre className="px-2 py-1 font-normal text-md text-red-500">
          {outputDetails?.stderr
            ? escapeHtml(atob(outputDetails.stderr))
            : "No stderr"}
        </pre>
      );
    }
  };

  return (
    <div className="w-full flex flex-col items-start space-y-2 h-2/5">
      <h1 className="text-gray-50 text-2xl py-3 underline underline-offset-4 border-gray-50 rounded-md text-center">
        Output
      </h1>
      <div className="w-full h-[38vh] bg-[#1E1E1E] rounded-md text-gray-300 font-normal overflow-y-auto border-2 border-gray-50 p-4">
        {outputDetails ? getOutput() : "No output available"}
      </div>
    </div>
  );
};

export default OutputWindow;
