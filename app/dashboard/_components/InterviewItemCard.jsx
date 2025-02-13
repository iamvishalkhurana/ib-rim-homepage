"use client";
import { Button } from "@/components/ui/button";
import { db } from "@/utils/db";
import { MockInterview, UserAnswer } from "@/utils/schema";
import { eq } from "drizzle-orm";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

const InterviewItemCard = ({ interview }) => {
  const router = useRouter();
  const onStart = async () => {
    const resp = await db
      .delete(UserAnswer)
      .where(eq(UserAnswer.mockIdRef, interview.mockId));
    const resp2 = await db
      .update(MockInterview)
      .set({ createdAt: moment().format("DD-MM-YYYY") })
      .where(eq(MockInterview.mockId, interview.mockId));

    router.push("/dashboard/interview/" + interview.mockId);
  };
  return (
    <div className="border shadow-sm rounded-lg p-3">
      <h2 className="font-bold text-blue-700">{interview?.jobPosition}</h2>
      <h2 className="text-sm text-gray-700">
        {interview?.jobExperience} years of experience
      </h2>
      <h2 className="text-xs text-gray-600">
        Created At: {interview?.createdAt}
      </h2>
      <div className="flex justify-between my-2 gap-5">
        <Link href={`/dashboard/interview/${interview.mockId}/feedback`}>
          <Button size="sm" variant="outline" className="w-full">
            Feedback
          </Button>
        </Link>
        <Button
          size="sm"
          onClick={onStart}
          title="Previous interview will be deleted if you start the same interview again"
        >
          Start again
        </Button>
      </div>
    </div>
  );
};

export default InterviewItemCard;
