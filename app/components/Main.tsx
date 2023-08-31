"use client";
import { useEffect, useState } from "react";
import { OpenAI } from "langchain/llms/openai";
import { BufferMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";

const model = new OpenAI({
  openAIApiKey: process.env.NEXT_PUBLIC_OPENAI_KEY,
  temperature: 0.9,
});

const memory = new BufferMemory();

const chain = new ConversationChain({
  llm: model,
  memory: memory,
});

const run = async (input: string) => {
  const response = await chain.call({ input: input });
  return response.response;
};

const courses = [
  { label: "Web and App", value: "web_app" },
  { label: "Data Science", value: "data_science" },
];


interface Option {
    label: string;
    value: string;
  }

  const options: Record<string, Option[]> = {
  web_app: [
    { label: "HTML", value: "html" },
    { label: "CSS", value: "css" },
    { label: "JavaScript", value: "javascript" },
    { label: "React", value: "reactjs" },
    { label: "Node.js", value: "nodejs" },
    { label: "MongoDB", value: "mongodb" },
  ],
  data_science: [
    { label: "NumPy", value: "numpy" },
    { label: "Pandas", value: "pandas" },
  ],
};

const Main = () => {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [course, setCourse] = useState("");
  const [topic, setTopic] = useState("");

  const askFirstQuestion = async () => {
    const firstQuestion = await run(
      `Ask a trivia question in the ${topic} category with 4 options.`
    );
    setResponse(firstQuestion);
  };

  useEffect(() => {
    if (topic !== "") {
      askFirstQuestion();
    }
  }, [topic]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const result = await run(
      `AI: ${response}\nYou: ${input}\nAI: Evaluate the answer right or wrong and ask another trivia question with 4 options`
    );
    setResponse(result);
    setInput("");
  };

  return (
    <div className="flex justify-center items-center h-screen mt-4">
      <div className="container mx-auto w-full sm:w-11/12 mb-[20%] md:w-3/4 xl:w-1/2">
        <h1 className="text-4xl text-center font-bold mb-4">TechGenius: The Ultimate IT Quiz</h1>
        <h1 className="text-2xl text-center font-bold mb-4">{topic}</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Your Answer"
          />
  

             <select
            value={course}
            onChange={(e) => setCourse(e.currentTarget.value)}
            className="p-2  border w-[50%] border-gray-300 rounded mx-auto"
          >
            <option value="" className="text-center">
              Select a Course
            </option>
            {courses.map((course) => (
              <option key={course.value} value={course.value} className="text-center">
                {course.label}
              </option>
            ))}
          </select>
  
          <select
            value={topic}
            onChange={(e) => setTopic(e.currentTarget.value)}
            className="p-2 border w-[50%] border-gray-300 rounded mx-auto"
          >
            <option value="" className="text-center">
              Select a Topic
            </option>
            {course &&
              options[course].map((topic) => (
                <option key={topic.value} value={topic.value} className="text-center">
                  {topic.label}
                </option>
              ))}
          </select>

  
          <button
            type="submit"
            className="w-full p-2 bg-black text-white font-semibold rounded-[50px] "
          >
            Submit
          </button>
        </form>
        {response && (
          <div className="mt-4 p-4 bg-zinc-50 border border-gray-900 shadow rounded">
            <p className="text-center">{response}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Main;