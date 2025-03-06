"use client";
import { Button } from "@/components/ui/button";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { LoaderCircle, WebcamIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";
import { Lightbulb } from "lucide-react";
import Link from "next/link";

const Interview = ({ params }) => {
  const [interviewDetails, setInterviewDetails] = useState(null);
  const [isCamEnabled, setIsCamEnabled] = useState(false);
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
    <div className="my-6">
      <h2 className="font-semibold text-2xl  ">Let's Get Started</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-6">
        {" "}
        <div className="flex flex-col  justify-center ">
          <div className=" flex flex-col border rounded-md justify-center gap-8 p-2">
            <h2>
              <strong>Job Role / Job Position: </strong>
              {interviewDetails.jobPosition}
            </h2>
            <h2>
              <strong>Job Description / Tech Stack: </strong>
              {interviewDetails.jobDesc}
            </h2>
            <h2>
              <strong>Years of Experience: </strong>
              {interviewDetails.jobExperience}
            </h2>
          </div>
          <div className=" mt-4 p-5 rounded-lg border border-yellow-300 bg-yellow-100">
            <h2 className="text-yellow-500">
              <Lightbulb className="inline-block" />
              <strong className="inline-block underline">Information</strong>
            </h2>
            <h2 className="text-yellow-500 text-sm mt-3">
              Enable Video Web Cam and Microphone to start your AI generated
              mock inteview. It has 5 questions which you can answer and at the
              last you will get a report based on your responses.
              <br /> NOTE: We never record your video, you can disable web cam
              access at any point.
            </h2>
          </div>
        </div>
        <div className="flex flex-col justify-center">
          {isCamEnabled ? (
            <Webcam
              style={{
                height: 400,
                width: 600,
                borderRadius: 10,
              }}
              onUserMedia={() => setIsCamEnabled(true)}
              onUserMediaError={() => setIsCamEnabled(false)}
              mirrored={true}
            />
          ) : (
            <>
              <WebcamIcon className="h-72 w-full my-6 p-20 rounded-lg bg-secondary" />
              <div className="flex justify-center w-full">
                <Button
                  variant="ghost"
                  className=""
                  onClick={() => {
                    setIsCamEnabled(true);
                  }}
                >
                  Enable Web Camera and Microphone
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="flex justify-center items-end mt-10">
        <Link href={`/dashboard/interview/${params.interviewId}/start`}>
          <Button>Start Interview</Button>
        </Link>
      </div>
    </div>
  );
};

export default Interview;
