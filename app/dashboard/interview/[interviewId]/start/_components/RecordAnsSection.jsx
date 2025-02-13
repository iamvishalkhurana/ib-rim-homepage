"use client";
import { Button } from "@/components/ui/button";
import { chatSession } from "@/utils/GeminiAPI";
import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { is } from "drizzle-orm";
import { Mic } from "lucide-react";
import moment from "moment";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import useSpeechToText from "react-hook-speech-to-text";
import Webcam from "react-webcam";
import { toast } from "sonner";

const RecordAnsSection = ({
  interviewQuestions,
  activeQuestionIndex,
  interviewDetails,
}) => {
  const [userAnswer, setUserAnswer] = useState("");
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const {
    error,
    interimResult,
    isRecording,
    results,
    setResults,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
    crossBrowser: true,
  });
  useEffect(() => {
    results.map((result) => {
      setUserAnswer((prevAns) => prevAns + result?.transcript);
    });
  }, [results]);

  useEffect(() => {
    if (!isRecording && userAnswer.length > 10) {
      updateUserAnswer();
    }
  }, [userAnswer]);

  const saveUserAnswer = async () => {
    if (isRecording) {
      setLoading(true);
      stopSpeechToText();
      setUserAnswer("");
    } else {
      startSpeechToText();
    }
  };

  const updateUserAnswer = async () => {
    console.log(userAnswer);
    setLoading(true);
    const feedbackPrompt = `Question:${interviewQuestions[activeQuestionIndex].question} , User Answer : ${userAnswer}. Depending on the question and user answer, please give us rating and feedback on how the user performed in just 3 to 5 lines, in JSON format with rating field and feedback field.`;
    const result = await chatSession.sendMessage(feedbackPrompt);
    const MockJsonResp = result.response
      .text()
      .trim()
      .replace("```json", "")
      .replace("```", "");
    console.log(userAnswer, MockJsonResp);
    const jsonFeedbackResp = JSON.parse(MockJsonResp);

    const resp = await db.insert(UserAnswer).values({
      mockIdRef: interviewDetails.mockId,
      question: interviewQuestions[activeQuestionIndex].question,
      correctAns: interviewQuestions[activeQuestionIndex].answer,
      userAns: userAnswer,
      feedback: jsonFeedbackResp?.feedback,
      rating: jsonFeedbackResp?.rating,
      userEmail: user.primaryEmailAddress.emailAddress,
      createdAt: moment().format("DD-MM-YYYY"),
    });

    if (resp) {
      toast("User Answer recording successfully");
    }
    setResults([]);
    setLoading(false);
  };

  if (error) return <p>Web Speech API is not available in this browser 🤷‍</p>;
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex flex-col justify-center items-center bg-black rounded-lg p-5 mt-20">
        <Image
          src={"/webcam.svg"}
          width={200}
          height={200}
          className="absolute"
        />
        <Webcam
          mirrored={true}
          style={{
            height: 300,
            width: "100%",
            zIndex: 10,
          }}
        />
      </div>
      <Button
        variant="outline"
        className="my-10"
        onClick={saveUserAnswer}
        disable={loading}
      >
        {isRecording ? (
          <h2 className="text-red-500">
            <Mic className="inline-block" /> Stop Recording
          </h2>
        ) : (
          " Record Answer"
        )}
      </Button>
    </div>
  );
};

export default RecordAnsSection;
