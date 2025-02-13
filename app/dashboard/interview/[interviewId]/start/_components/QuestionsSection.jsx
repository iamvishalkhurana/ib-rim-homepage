import { Lightbulb, Volume2 } from "lucide-react";
import React, { useState } from "react";

const QuestionsSection = ({ interviewQuestions, activeQuestionIndex }) => {
  const textToSpeech = (question) => {
    if ("speechSynthesis" in window) {
      const speech = new SpeechSynthesisUtterance(question);
      window.speechSynthesis.speak(speech);
    } else {
      alert("Sorry your browser doesn't support text to speech");
    }
  };

  return (
    interviewQuestions && (
      <div className="p-5 border rounded-lg my-10">
        <div className=" grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {interviewQuestions &&
            interviewQuestions.map((question, index) => (
              <h2
                className={`p-2 bg-secondary rounded-full text-sm text-center ${
                  activeQuestionIndex === index && "bg-blue-700 text-white"
                }`}
              >
                Question {index + 1}
              </h2>
            ))}
        </div>
        <h2 className="my-5 text-md md:text-lg">
          {interviewQuestions[activeQuestionIndex]?.question}
        </h2>
        <h2 className="flex gap-2 items-center">
          <Volume2
            className="cursor-pointer"
            onClick={() =>
              textToSpeech(interviewQuestions[activeQuestionIndex]?.question)
            }
          />
          <p className="text-sm"> Click to listen to the question</p>
        </h2>
        <div className="border rounded-lg p-5 bg-blue-100 mt-20">
          <h2 className="flex gap-3 items-center text-blue-700">
            <Lightbulb />
            <strong>Note:</strong>
          </h2>
          <h2 className=" text-sm text-blue-700 my-2">
            {process.env.NEXT_PUBLIC_QUESTION_NOTE}
          </h2>
        </div>
      </div>
    )
  );
};

export default QuestionsSection;
