
"use client";

import { FormEvent, useState } from "react";
import rules from "./rules.json";

type Message = {
  id: number;
  sender: "user" | "bot";
  text: string;
};

type Rule = {
  intent: string;
  keywords: string[];
  reply: string;
};

const chatbotRules = rules as Rule[];

const welcomeMessage: Message = {
  id: 1,
  sender: "bot",
  text: "Assalam-o-Alaikum! 👋 Welcome to UOS Helpdesk Bot. How can I help you today? You can ask me about fees, admissions, university timings, library services, or hostels.",
};

function normalizeMessage(message: string): string {
  return message.toLowerCase().trim().replace(/\s+/g, " ");
}

function getBotReply(userMessage: string): string {
  const normalizedMessage = normalizeMessage(userMessage);

  // Check longer keywords first for more specific matches.
  const sortedRules = chatbotRules.map((rule) => ({
    ...rule,
    keywords: [...rule.keywords].sort(
      (a, b) => b.length - a.length
    ),
  }));

  for (const rule of sortedRules) {
    const matched = rule.keywords.some((keyword) =>
      normalizedMessage.includes(normalizeMessage(keyword))
    );

    if (matched) {
      return rule.reply;
    }
  }

  return "Sorry, I couldn't understand your question. 😊 Please ask me about UOS fees, admissions, timings, library services, or hostels.";
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    welcomeMessage,
  ]);
  const [input, setInput] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const userText = input.trim();

    if (!userText) return;

    const userMessage: Message = {
      id: Date.now(),
      sender: "user",
      text: userText,
    };

    const botMessage: Message = {
      id: Date.now() + 1,
      sender: "bot",
      text: getBotReply(userText),
    };

    setMessages((previousMessages) => [
      ...previousMessages,
      userMessage,
      botMessage,
    ]);

    setInput("");
  }

  const suggestions = [
    "What is the fee structure?",
    "How can I apply for admission?",
    "What are the university timings?",
    "Tell me about the library",
    "How can I get a hostel?",
  ];

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-100 p-3 sm:p-6">
      <section className="flex h-[90vh] min-h-[500px] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-2xl shadow-blue-900/10">
        {/* Header */}
        <header className="flex items-center gap-4 bg-gradient-to-r from-blue-700 to-indigo-700 px-5 py-5 text-white sm:px-7">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-2xl">
            🎓
          </div>

          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
              UOS Helpdesk Bot
            </h1>
            <p className="mt-1 text-sm text-blue-100">
              University of Sargodha • Student Support
            </p>
          </div>

          <div className="hidden items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-xs sm:flex">
            <span className="h-2 w-2 rounded-full bg-green-400" />
            Online
          </div>
        </header>

        {/* Chat messages */}
        <div
          className="flex-1 space-y-5 overflow-y-auto bg-slate-50/80 px-4 py-6 sm:px-7"
          aria-live="polite"
          aria-label="Chat messages"
        >
          <div className="text-center">
            <span className="rounded-full bg-white px-4 py-2 text-xs text-slate-500 shadow-sm">
              Welcome to student support
            </span>
          </div>

          {messages.map((message) => {
            const isUser = message.sender === "user";

            return (
              <div
                key={message.id}
                className={`flex items-end gap-2 ${
                  isUser ? "justify-end" : "justify-start"
                }`}
              >
                {!isUser && (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-lg">
                    🎓
                  </div>
                )}

                <div
                  className={`max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm sm:max-w-[78%] ${
                    isUser
                      ? "rounded-br-md bg-blue-700 text-white"
                      : "rounded-bl-md border border-slate-100 bg-white text-slate-700"
                  }`}
                >
                  {message.text}
                </div>

                {isUser && (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
                    You
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Suggested questions */}
        <div className="border-t border-slate-100 bg-white px-4 pt-4 sm:px-6">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Quick questions
          </p>

          <div className="flex gap-2 overflow-x-auto pb-3">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => setInput(suggestion)}
                className="shrink-0 rounded-full border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-medium text-blue-700 transition hover:border-blue-500 hover:bg-blue-100"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Message input */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-3 border-t border-slate-100 bg-white p-4 sm:px-6 sm:py-5"
        >
          <label htmlFor="chat-input" className="sr-only">
            Type your question
          </label>

          <input
            id="chat-input"
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask about fees, admissions, library..."
            autoComplete="off"
            className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
          />

          <button
            type="submit"
            disabled={!input.trim()}
            className="flex shrink-0 items-center gap-2 rounded-2xl bg-blue-700 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-700/20 transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-40 sm:px-5"
          >
            <span>Send</span>
            <span aria-hidden="true">➤</span>
          </button>
        </form>

        <footer className="bg-white pb-3 text-center text-xs text-slate-400">
          UOS Helpdesk Bot • Rule-based student assistance
        </footer>
      </section>
    </main>
  );
}
