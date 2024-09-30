import React, { useState } from "react";
import axios, { AxiosRequestConfig } from "axios";

// Import necessary components and constants
import CodeEditorWindow from "../components/CodeEditorWindow";
import { languageOptions } from "../constants/languageOptions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OutputWindow from "../components/OutputWindow";
import LanguagesDropdown from "../components/LanguageDropdown";
import FeedBackWindow from "../components/FeedbackWindow";

// Import types
import { LanguageOption, OutputDetails } from "../types/types";
import GradeWindow from "../components/GradeWindow";

const javascriptDefault = `// some comment`;

const HomePage: React.FC = () => {
  const [language, setLanguage] = useState<LanguageOption>(languageOptions[0]);
  const [question, setQuestion] = useState<string>(""); // State for the code question
  const [code, setCode] = useState<string>(javascriptDefault);
  const [processing, setProcessing] = useState<boolean>(false);
  const [outputDetails, setOutputDetails] = useState<OutputDetails | null>(
    null
  );
  const [feedback, setFeedback] = useState<string>(
    "Your feedback will appear here..."
  );

  const [grade, setGrade] = useState<string>(
    "The grades of the code will be shown here..."
  );

  const onSelectChange = (sl: LanguageOption) => {
    setLanguage(sl);
  };

  const onChange = (action: string, data: string) => {
    switch (action) {
      case "code": {
        setCode(data);
        break;
      }
      default: {
        console.warn("case not handled!", action, data);
      }
    }
  };

  const handleCompile = () => {
    setProcessing(true);
    const formData = {
      language_id: language.id,
      source_code: btoa(code), // encode source code in base64
      stdin: btoa(""),
    };

    console.log(formData);
    console.log(code);
    const options: AxiosRequestConfig = {
      method: "POST",
      url: import.meta.env.VITE_APP_RAPID_API_URL,
      params: { base64_encoded: "true", fields: "*", wait: "false" },
      headers: {
        "Content-Type": "application/json",
        "X-RapidAPI-Host": import.meta.env.VITE_APP_RAPID_API_HOST,
        "X-RapidAPI-Key": import.meta.env.VITE_APP_RAPID_API_KEY,
      },
      data: formData,
    };

    axios
      .request(options)
      .then(function (res) {
        console.log("res.data", res.data);
        const token = res.data.token;
        checkStatus(token);
      })
      .catch((err) => {
        const error = err.response ? err.response.data : err;
        const status = err.response?.status;
        console.log("status", status);
        if (status === 429) {
          console.log("too many requests", status);
          showErrorToast(
            `Quota of 100 requests exceeded for the Day! Please read the blog on freeCodeCamp to learn how to setup your own RAPID API Judge0!`,
            10000
          );
        }
        setProcessing(false);
        console.log("catch block...", error);
      });
  };

  const checkStatus = async (token: string) => {
    const options: AxiosRequestConfig = {
      method: "GET",
      url: `${import.meta.env.VITE_APP_RAPID_API_URL}/${token}`,
      params: { base64_encoded: "true", fields: "*" },
      headers: {
        "X-RapidAPI-Host": import.meta.env.VITE_APP_RAPID_API_HOST,
        "X-RapidAPI-Key": import.meta.env.VITE_APP_RAPID_API_KEY,
      },
    };

    try {
      const res = await axios.request(options);
      const statusId = res.data.status?.id;

      if (statusId === 1 || statusId === 2) {
        // still processing
        setTimeout(() => {
          checkStatus(token);
        }, 2000);
      } else {
        setProcessing(false);
        setOutputDetails(res.data);
        showSuccessToast(`Compiled Successfully!`);
        console.log("res.data", res.data);
      }
    } catch (err) {
      console.log("err", err);
      setProcessing(false);
      showErrorToast();
    }
  };

  const handleFeedbackButton = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/generate-feedback`,
        { code: code, question: question, language: language.name } // Send code and question
      );
      console.log(response.data);
      setFeedback(response.data.generated_text || "No feedback available");
    } catch (error) {
      console.error("Error fetching feedback:", error);
      setFeedback("Error fetching feedback");
    }
  };

  const handleGradeButton = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/grade-the-code`,
        {
          code: code,
          question: "", // Optional: can be empty string or null
          language: "", // Optional: can be empty string or null
        }
      );
      console.log(response.data);
      setGrade(response.data)
    } catch (error) {
      console.error("Error fetching grade:", error);
    }
  };

  const showSuccessToast = (msg: string) => {
    toast.success(msg || `Compiled Successfully!`, {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const showErrorToast = (msg?: string, timer?: number) => {
    toast.error(msg || `Something went wrong! Please try again.`, {
      position: "top-right",
      autoClose: timer ? timer : 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="px-8 flex items-center justify-evenly space-x-10 h-screen w-screen bg-gray-950">
        <div className="flex flex-col justify-center h-screen w-1/2 bg-gray-950I">
          <div className="flex flex-row justify-between items-center">
            <div className="py-1">
              <LanguagesDropdown onSelectChange={onSelectChange} />
            </div>
            <div className="flex space-x-6 ">
              <div
                className="border-2 border-gray-50 h-10 text-gray-50 flex justify-center items-center px-4 rounded-md cursor-pointer hover:bg-gray-50 hover:text-gray-900"
                onClick={handleCompile}
              >
                {processing ? "Processing..." : "Execute"}
              </div>
              <div
                className="border-2 border-gray-50 h-10 text-gray-50 flex justify-center items-center px-4 rounded-md cursor-pointer hover:bg-gray-50 hover:text-gray-900"
                onClick={handleFeedbackButton}
              >
                Feedback
              </div>
              <div
                className="border-2 border-gray-50 h-10 text-gray-50 flex justify-center items-center px-4 rounded-md cursor-pointer hover:bg-gray-50 hover:text-gray-900"
                onClick={handleGradeButton}
              >
                Grade
              </div>
            </div>
          </div>
          {/* Added spacing for the new input */}
          <div className="flex flex-row justify-between items-center my-3">
            <textarea
              className="w-full h-12 p-2 border-2 border-gray-50 rounded-md bg-[#1E1E1E] text-gray-100 flex justify-center items-center resize-none placeholder-gray-100"
              placeholder="Enter your code question here..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </div>
          <div className="flex flex-row space-x-4 items-start py-4">
            <div className="flex flex-col w-full h-full justify-start items-end">
              <CodeEditorWindow
                code={code}
                onChange={onChange}
                language={language?.value}
              />
            </div>
          </div>
        </div>
        <hr className="text-gray-50 bg-gray-50 w-0.5 h-[96vh]" />
        <div className="flex flex-col justify-start items-center w-1/2 h-screen bg-gray-950 py-4">
          <OutputWindow outputDetails={outputDetails} />
          <GradeWindow grade={grade} />
          <FeedBackWindow feedback={feedback} />
        </div>
      </div>
    </>
  );
};

export default HomePage;
