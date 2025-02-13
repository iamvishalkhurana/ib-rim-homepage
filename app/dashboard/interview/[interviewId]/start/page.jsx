"use client";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { LoaderCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import QuestionsSection from "./_components/QuestionsSection";
import RecordAnsSection from "./_components/RecordAnsSection";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const StartInterview = ({ params }) => {
  const [interviewDetails, setInterviewDetails] = useState(null);
  const [interviewQuestions, setInterviewQuestions] = useState([]);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const getInterviewDetails = async () => {
    if (params.interviewId) {
      try {
        const result = await db
          .select()
          .from(MockInterview)
          .where(eq(MockInterview.mockId, params.interviewId));
        console.log(result);
        setInterviewDetails(result[0]);
        const jsonMockResp = JSON.parse(result[0].jsonMockResp);
        setInterviewQuestions(jsonMockResp);
        console.log(jsonMockResp);
      } catch (error) {
        console.error("Failed to fetch interview details:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    getInterviewDetails();
  }, [params.interviewId]);

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <LoaderCircle className="animate-spin w-20 h-20 " />
      </div>
    );
  }

  if (!interviewDetails) {
    return <div>No interview details found.</div>;
  }
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <QuestionsSection
          interviewQuestions={interviewQuestions}
          activeQuestionIndex={activeQuestionIndex}
        />
        <RecordAnsSection
          interviewQuestions={interviewQuestions}
          activeQuestionIndex={activeQuestionIndex}
          interviewDetails={interviewDetails}
        />
      </div>
      <div className="flex justify-end gap-6">
        {activeQuestionIndex > 0 && (
          <Button onClick={() => setActiveQuestionIndex((curr) => curr - 1)}>
            Previous Question
          </Button>
        )}
        {activeQuestionIndex !== interviewQuestions.length - 1 && (
          <Button onClick={() => setActiveQuestionIndex((curr) => curr + 1)}>
            Next Question
          </Button>
        )}
        {activeQuestionIndex === interviewQuestions.length - 1 && (
          <Link
            href={`/dashboard/interview/${interviewDetails.mockId}/feedback`}
          >
            <Button>End Interview</Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default StartInterview;
