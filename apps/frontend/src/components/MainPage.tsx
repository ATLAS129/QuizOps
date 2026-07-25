import { useRef } from "react";
import { FaFilePdf } from "react-icons/fa6";

const MainPage = () => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInput = () => {
    if (!textareaRef.current) return;

    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  };

  return (
    <main className="p-3">
      <div className="w-full max-h-1/2 bg-bg-surface flex flex-col items-center p-3">
        <div className="pt-16 pb-10 bg-bg-background flex flex-col justify-center items-center gap-8 w-full">
          <div className="w-full flex justify-center items-center cursor-pointer">
            <FaFilePdf className="size-24" />
          </div>

          <p>
            <span className="underline cursor-pointer hover:no-underline">
              Select
            </span>{" "}
            or drop PDF here
          </p>
        </div>
        <p className="py-3 text-center">Or / And</p>

        <div className="w-full flex flex-col justify-center items-center">
          <div className="w-full pb-2 flex items-center">
            <label htmlFor="url" className="w-1/5">
              URL
            </label>
            <input
              type="text"
              id="url"
              className="flex-1 border p-2 rounded-sm"
            />
          </div>
          <div className="w-full pt-2 flex items-center">
            <label htmlFor="prompt" className="w-1/5">
              Prompt
            </label>
            <textarea
              ref={textareaRef}
              rows={1}
              onInput={handleInput}
              className="p-2 w-full resize-none overflow-y-auto border min-h-11 max-h-50 flex-1 rounded-sm"
            />
          </div>
        </div>

        <div className="text-text-muted text-sm pb-2 pt-4">
          Choose atleast one option
        </div>
        <div className="">
          <button className="py-2 px-5 bg-accent-primary cursor-pointer rounded-md">
            Generate
          </button>
        </div>
      </div>
    </main>
  );
};

export default MainPage;
