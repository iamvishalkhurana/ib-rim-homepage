"use client";
import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { ChevronsUpDown, User } from "lucide-react";
import React, { useEffect, useState } from "react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const Feedback = ({ params }) => {
  const router = useRouter();
  const [feedbackList, setFeedbackList] = useState([]);
  useEffect(() => {
    getFeedback();
  }, []);
  const getFeedback = async () => {
    const result = await db
      .select()
      .from(UserAnswer)
      .where(eq(UserAnswer.mockIdRef, params.interviewId))
      .orderBy(UserAnswer.id);
    setFeedbackList(result);
    console.log(result);
  };
  return feedbackList.length ? (
    <div className="p-10">
      <h2 className="text-3xl font-bold text-green-500">Congratulations !!</h2>
      <h2 className="font-bold text-xl">Here is your interview feedback</h2>

      <h2 className="text-sm text-gray-500">
        Find below interview question with correct answer, your answer and
        feedback for improvement
      </h2>

      {feedbackList &&
        feedbackList.map((feedback, index) => (
          <Collapsible key={index} className="my-7">
            <CollapsibleTrigger className="p-2 bg-secondary rounded-lg my-2 text-left flex justify-between gap-7">
              {feedback.question} <ChevronsUpDown className="h-5 w-5" />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="flex flex-col gap-2">
                <h2 className="text-red-500 p-2 border rounded-lg ">
                  <strong>Rating: </strong>
                  {feedback.rating}
                </h2>
                <h2 className="p-2 border rounded-lg bg-blue-50 text-blue-500 text-sm">
                  <strong>Your Answer: </strong>
                  {feedback.userAns}
                </h2>
                <h2 className="p-2 border rounded-lg bg-green-50 text-green-500 text-sm">
                  <strong>Correct Answer: </strong>
                  {feedback.correctAns}
                </h2>
                <h2 className="p-2 border rounded-lg bg-yellow-50 text-yellow-500 text-sm">
                  <strong>Feedback: </strong>
                  {feedback.feedback}
                </h2>
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      <Button onClick={() => router.replace("/dashboard")}>Go Home</Button>
    </div>
  ) : (
    <div className="mt-5">
      <h2>No Interview Feedback Found :(</h2>
      <Button onClick={() => router.replace("/dashboard")}>Go Home</Button>
    </div>
  );
};

export default Feedback;
