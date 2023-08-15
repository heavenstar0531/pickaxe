"use client";
import { useState } from "react";

export default function Home() {
  const [propmt, setPrompt] = useState<string>("");
  const [openaiResult, setOpenaiResult] = useState<string>("");
  const [isShow, setIsShow] = useState<boolean>(false);

  const updateState =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setter(event.target.value);
    };

  const getPrompt = async () => {
    let data = { prompt: propmt };
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
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className="tk-ff-real-headline-pro">
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
              value={propmt}
              onChange={updateState(setPrompt)}
              className="w-full rounded-[4px] border-[1px] border-black p-[10px]"
              placeholder="In a phrase or two, describe what you want your bot to be good at."
            />
            <button
              onClick={getPrompt}
              className="p-4 rounded-sm bg-[#061B2B] text-white font-semibold w-44"
            >
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
              <button className="p-4 rounded-sm bg-[#061B2B] text-white font-semibold w-44">
                Build your app
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
