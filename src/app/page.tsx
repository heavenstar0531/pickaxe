"use client";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const [prompt, setPrompt] = useState<string>("");
  const [openaiResult, setOpenaiResult] = useState<string>("");
  const [isShow, setIsShow] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const updateState =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setter(event.target.value);
    };

  const getPrompt = async () => {
    if (prompt === "") {
      toast.error("Please input your prompt.");
      return;
    }
    setLoading(true);
    let data = { prompt: prompt };
    try {
      const response = await fetch("/api/prompt", {
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });
      const { msg } = await response.json();
      setOpenaiResult(msg.content);
      setIsShow(true);
      setTimeout(function () {
        document.getElementById("main")?.scrollBy({
          top: 300,
          behavior: "smooth",
        });
      }, 100);
      toast.success("Your prompt is generated!");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong...");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="tk-ff-real-headline-pro">
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
      <header className="px-12 py-5 border-b-2 border-solid border-[#1A1A1A] flex justify-between items-center">
        <div className="flex gap-[42px] items-center">
          <div className="flex gap-2 items-center">
            <img src="/image/axe.png" className="h-8" />
            <div className="text-[#000000CC] text-[32px] font-semibold">
              Pickaxe
            </div>
          </div>
          <div className="flex gap-8 font-semibold lg:gap-12">
            <div>Make a Pickaxe</div>
            <div>Dashboard</div>
            <div>Enterprise</div>
            <div>Tools</div>
          </div>
        </div>
        <div className="flex gap-3">
          <img src="/image/search.png" />
          <img src="/image/user.png" />
          <div className="font-semibold">UserName</div>
          <img src="/image/menu.png" />
        </div>
      </header>
      <div className="flex" style={{ height: "calc(100vh - 90px)" }}>
        <div className="w-1/2 bg-[#F5F1E9] flex flex-col justify-center items-center">
          <img src="/image/robot.png" />
          <div className="text-[32px] text-center font-semibold text-[#000000CC]">
            Create your own AI app <br /> with our wizard
          </div>
        </div>
        <div
          id="main"
          className="flex flex-col gap-14 justify-center items-center w-1/2 border-l-2 border-solid border-black py-72 overflow-auto"
        >
          <div className="w-full px-[70px] flex flex-col gap-4">
            <div className="flex gap-2 items-center">
              <img className="h-6" src="/image/zap.png" />
              <div className="text-2xl font-semibold">Step 1</div>
            </div>
            <div>Turn your idea into a prompt</div>
            <textarea
              value={prompt}
              onChange={updateState(setPrompt)}
              className="w-full rounded-[4px] border-[1px] border-black p-[10px]"
              placeholder="In a phrase or two, describe what you want your bot to be good at."
            />
            <button
              onClick={getPrompt}
              disabled={loading}
              className={`p-4 rounded-sm bg-[#061B2B] text-white font-semibold w-44 ${
                loading && "flex items-center opacity-80"
              } text-center`}
            >
              {loading && (
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
              Get your prompt
            </button>
          </div>
          {isShow && (
            <div id="answer" className="w-full px-[70px] flex flex-col gap-4">
              <div className="flex gap-2 items-center">
                <img className="h-6" src="/image/edit.png" />
                <div className="text-2xl font-semibold">Step 2</div>
              </div>
              <div>
                Look over your prompt, polish it, and turn it into an app
              </div>
              <textarea
                value={openaiResult}
                onChange={updateState(setOpenaiResult)}
                className="w-full rounded-[4px] border-[1px] border-black p-[10px] h-44"
              />
              <button
                disabled
                className="p-4 rounded-sm bg-[#061B2B] text-white font-semibold w-44 opacity-80"
              >
                Build your app
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
