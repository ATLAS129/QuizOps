import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { FaFilePdf } from "react-icons/fa6";
import DecksSection from "./DecksSection";
import { useCreateDeck } from "../hooks/useDecks";
import LoadingSpinner from "./LoadingSpinner";

export interface deckInterface {
  id: string;
  title: string;
  isCompleted: boolean;
  _count: { cards: number };
}

const MainPageComponent = () => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const dragCounterRef = useRef(0);
  const [url, setUrl] = useState("");
  const [prompt, setPrompt] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { mutate: createDeck, isPending: isCreating } = useCreateDeck();

  const handleFileSelect = (file: File | null) => {
    if (!file) {
      setPdfFile(null);
      return;
    }

    if (file.type !== "application/pdf") {
      setErrorMessage("Please select a PDF file.");
      return;
    }

    setErrorMessage(null);
    setPdfFile(file);
  };

  const handleFileInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(event.target.files?.[0] ?? null);
  };

  const handleDragEnter = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    dragCounterRef.current += 1;
    setIsDragActive(true);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDragLeave = () => {
    dragCounterRef.current = Math.max(0, dragCounterRef.current - 1);
    if (dragCounterRef.current === 0) {
      setIsDragActive(false);
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    dragCounterRef.current = 0;
    setIsDragActive(false);
    handleFileSelect(event.dataTransfer.files?.[0] ?? null);
  };

  const handleInput = () => {
    if (!textareaRef.current) return;

    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  };

  const handleCreateDeck = () => {
    if (!url.trim() && !prompt.trim() && !pdfFile) {
      setErrorMessage("Please provide a URL, prompt, or PDF file.");
      return;
    }

    setErrorMessage(null);

    createDeck(
      {
        url: url.trim() || undefined,
        prompt: prompt.trim() || undefined,
        file: pdfFile,
      },
      {
        onSuccess: () => {
          setUrl("");
          setPrompt("");
          setPdfFile(null);
          setErrorMessage(null);
        },
        onError: (error: any) => {
          setErrorMessage(error?.message || "Unable to create deck.");
        },
      },
    );
  };

  if (isCreating) return <LoadingSpinner />;

  return (
    <div className="py-3 px-2 flex flex-col gap-5">
      <div className="w-full max-h-1/2 bg-bg-surface flex flex-col items-center p-3">
        <h1 className="pb-3">
          💡Generate quizzes from PDFs, 💻websites, or your own instructions.🚀
        </h1>
        <div
          className={`group w-full overflow-hidden rounded-4xl bg-bg-background p-1 transition-all duration-300 ${
            isDragActive
              ? "shadow-2xl shadow-accent-primary/30"
              : pdfFile
                ? "shadow-2xl shadow-accent-primary/10 border border-accent-primary"
                : "shadow-2xl shadow-black/20 hover:-translate-y-0.5 hover:shadow-accent-primary/20"
          }`}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={handleFileInputChange}
          />

          <div
            className={`relative w-full min-h-65 rounded-3xl px-8 py-10 transition duration-300 ${
              isDragActive
                ? "bg-linear-to-br from-accent-primary/5 via-bg-background-90 to-accent-primary/5"
                : "bg-bg-background/95"
            } flex flex-col justify-center items-center gap-6 text-center cursor-pointer`}
          >
            {pdfFile && (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setPdfFile(null);
                  setErrorMessage(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className="absolute right-4 top-4 rounded-full border border-white/10 bg-bg-surface/90 px-3 py-1 text-xs text-text-muted transition hover:bg-bg-surface hover:text-white"
              >
                Remove PDF
              </button>
            )}

            <FaFilePdf
              className={`size-24 transition duration-300 group-hover:text-accent-primary ${pdfFile ? "text-accent-primary" : ""}`}
            />
            <div className="max-w-2xl select-none space-y-2">
              <p className="text-lg font-semibold text-white">
                {pdfFile
                  ? "PDF ready to generate"
                  : "Drag and drop a PDF file here"}
              </p>
              <p className="text-sm text-text-muted">
                {pdfFile ? pdfFile.name : "Supports PDF up to 50 MB"}
              </p>
            </div>
          </div>
        </div>
        <p className="px-5 py-2 text-center text-sm text-text-muted">
          or{" "}
          <button
            type="button"
            className="underline text-sm text-text-muted hover:no-underline"
            onClick={() => fileInputRef.current?.click()}
          >
            select a file
          </button>
        </p>
        <p className="w-full pb-4 pt-2 text-center text-text-muted px-3">
          You can combine multiple sources
        </p>

        <div className="w-full flex flex-col justify-center items-center gap-5 px-2">
          <div
            className={`w-full py-3 px-2 flex items-center gap-3 bg-bg-background rounded-lg transition duration-300 ${url ? "border border-accent-primary shadow-xl shadow-accent-primary/10 " : ""}`}
          >
            <label htmlFor="url" className="w-1/5 text-text-muted">
              📱URL
            </label>
            <input
              type="text"
              id="url"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              className={`flex-1 border px-2 py-3 rounded-sm border-accent-primary ${url ? "border-accent-primary" : "border-bg-surface-hover"}`}
              placeholder="Paste webpage URL..."
            />
          </div>
          <div
            className={`w-full py-4 px-2 flex items-center gap-3 bg-bg-background rounded-lg transition duration-300 ${prompt ? "border border-accent-primary shadow-xl shadow-accent-primary/10 " : ""}`}
          >
            <label htmlFor="prompt" className="w-1/5 text-text-muted">
              ✏️Prompt
            </label>
            <textarea
              ref={textareaRef}
              id="prompt"
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              onInput={handleInput}
              placeholder="Ask AI what quiz to create..."
              className={`px-2 py-2 w-full resize-none overflow-y-auto border min-h-11 max-h-50 flex-1 rounded-sm ${prompt ? "border-accent-primary" : "border-bg-surface-hover"}`}
            />
          </div>
        </div>

        <div className="pt-5">
          <button
            type="button"
            disabled={isCreating}
            className="py-2 px-32 rounded-lg bg-accent-primary text-white transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
            onClick={handleCreateDeck}
          >
            {isCreating ? "Generating..." : "Generate"}
          </button>
        </div>
        {errorMessage ? (
          <div className="w-full text-rose-400 text-sm pt-2">
            {errorMessage}
          </div>
        ) : (
          <div className="w-full text-text-muted text-xs pt-1">
            Choose at least one source
          </div>
        )}
      </div>

      <DecksSection />
    </div>
  );
};

export default MainPageComponent;
