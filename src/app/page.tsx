"use client";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import TextareaAutosize from "react-autosize-textarea";
import "react-toastify/dist/ReactToastify.css";

import localFont from "@next/font/local";

//import './styles/globals.scss';

const realHeadPro = localFont({
  src: [
    {
      path: "../../public/fonts/RealHeadPro-SemiLight.ttf",
      weight: "300",
    },
    {
      path: "../../public/fonts/RealHeadPro-Regular.ttf",
      weight: "400",
    },
    {
      path: "../../public/fonts/RealHeadPro-Demibold.ttf",
      weight: "600",
    },
    {
      path: "../../public/fonts/RealHeadPro-Bold.ttf",
      weight: "700",
    },
  ],
  fallback: ["Helvetica", "ui-sans-serif"],
  display: "swap",
});

import "./globals.css";

export default function Home() {
  const [prompt, setPrompt] = useState<string>("");
  const [openaiResult, setOpenaiResult] = useState<string>("");
  const [isShow, setIsShow] = useState<boolean>(false);
  const [loading1, setLoading1] = useState<boolean>(false);
  const [loading2, setLoading2] = useState<boolean>(false);
  const [isPromptError, setIsPromptError] = useState<boolean>(false);
  const [isBuildError, setIsBuildError] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const updateState =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setter(event.target.value);
    };

  const getPrompt = async () => {
    setIsPromptError(false);
    if (prompt === "") {
      setErrorMsg(
        "To get your prompt, type something in the text box. E.g.“I want a bot that suggests recipes based on ingredients I have”"
      );
      setIsPromptError(true);
      return;
    }
    setLoading1(true);
    let data = { prompt: prompt };
    const controller = new AbortController();
    try {
      const response = await fetch("/api/prompt", {
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        signal: controller.signal,
      });
      const streamData = response.body;
      const reader = streamData?.getReader();
      const decoder = new TextDecoder();
      let text = "";
      let done = false;

      setIsShow(true);
      setTimeout(function () {
        document.getElementById("main")?.scrollBy({
          top: 300,
          behavior: "smooth",
        });
      }, 100);
      while (!done) {
        if (reader) {
          const { value, done: doneReading } = await reader.read();
          done = doneReading;
          const chunkValue = decoder.decode(value);
          text += chunkValue;
          setOpenaiResult(text);
        }
      }

      toast.success("Your prompt is generated!");
    } catch (error) {
      console.error(error);
      setErrorMsg("Something went wrong. Please try again.");
      setIsPromptError(true);
    } finally {
      setLoading1(false);
    }
  };

  const handleBuilder = async () => {
    setIsBuildError(false);
    if (openaiResult === "") {
      setErrorMsg(
        "To build your app, you need to start with a Pickaxe prompt."
      );
      setIsBuildError(true);
      return;
    }
    setLoading2(true);

    let data = { prompt: openaiResult };
    try {
      const response = await fetch("/api/builder", {
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });
      const { link } = await response.json();
      if (window.top) {
        window.top.location.href = link;
      } else {
        window.location.href = link;
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong...");
    } finally {
      setLoading2(false);
    }
  };

  return (
    <main>
      <ToastContainer
        closeOnClick
        draggable
        pauseOnFocusLoss
        pauseOnHover
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={false}
        position="top-right"
        theme="dark"
      />
      <div className="flex">
        <div className="w-1/2 bg-[#F5F1E9] flex flex-col justify-start items-center  py-40">
          <img src="/image/robot.png" />
          <div className="text-2xl font-semibold text-center">
            Let AI auto-<span style={{ color: "#EBA300" }}>magically</span>{" "}
            create your Pickaxe. <br /> Try it out!
          </div>
        </div>
        <div
          id="main"
          className="flex flex-col justify-start items-center w-1/2 border-l-2 border-solid border-black py-80"
        >
          <div className="w-full px-[70px] flex flex-col gap-4">
            <div className="flex gap-2 items-center">
              <img className="h-6" src="/image/zap.png" />
              <div className="text-2xl font-semibold">Describe</div>
            </div>
            <div>
              Your idea will be automatically expanded into a Pickaxe prompt.
            </div>
            <TextareaAutosize
              value={prompt}
              onChange={updateState(setPrompt)}
              className="w-full rounded-[4px] border-[1px] border-black p-[10px]"
              placeholder="Describe what your Pickaxe should do..."
            />
            <button
              onClick={getPrompt}
              disabled={loading1 || loading2}
              className={`p-4 rounded-sm bg-[#061B2B] text-white font-semibold w-48 ${
                !loading1 && !loading2 && "hoverButton"
              } ${
                (loading1 || loading2) &&
                "flex items-center justify-center gap-1 opacity-80"
              } text-center`}
            >
              {loading1 && (
                <div role="status">
                  <svg
                    aria-hidden="true"
                    className="w-4 h-4 mr-1 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  <span className="sr-only">Loading...</span>
                </div>
              )}
              Generate
            </button>
            {isPromptError && (
              <div className="mt-4 flex gap-2">
                <img src="/image/error.png" className="h-5" />
                <div className="text-[#f00] text-sm font-semibold">
                  {errorMsg}
                </div>
              </div>
            )}
          </div>
          {isShow && (
            <div
              id="answer"
              className="w-full px-[70px] pt-14 flex flex-col gap-4"
            >
              <div className="flex gap-2 items-center">
                <img className="h-6" src="/image/edit.png" />
                <div className="text-2xl font-semibold">Review</div>
              </div>
              <div>
                Polish your Pickaxe prompt. When you're ready, turn it into an
                app.
              </div>
              <TextareaAutosize
                value={openaiResult}
                onChange={updateState(setOpenaiResult)}
                className="w-full rounded-[4px] border-[1px] border-black p-[10px] h-44"
              />
              <button
                className={`p-4 rounded-sm bg-[#061B2B] text-white font-semibold w-48 ${
                  !loading1 && !loading2 && "hoverButton"
                } ${
                  (loading2 || loading1) &&
                  "flex items-center justify-center gap-1 opacity-80"
                }`}
                disabled={loading2 || loading1}
                onClick={handleBuilder}
              >
                {loading2 && (
                  <div role="status">
                    <svg
                      aria-hidden="true"
                      className="w-4 h-4 mr-1 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                    <span className="sr-only">Loading...</span>
                  </div>
                )}
                Create
              </button>
              {isBuildError && (
                <div className="mt-4 flex gap-2">
                  <img src="/image/error.png" className="h-5" />
                  <div className="text-[#f00] text-sm font-semibold">
                    {errorMsg}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div data-iframe-height></div>
    </main>
  );
}
