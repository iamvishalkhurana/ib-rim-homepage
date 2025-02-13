"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { chatSession } from "@/utils/GeminiAPI";
import { Loader2 } from "lucide-react";
import { json } from "drizzle-orm/mysql-core";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import moment from "moment/moment";
import { useRouter } from "next/navigation";

const AddNewInterview = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [jobExperience, setJobExperience] = useState("");
  const [loading, setLoading] = useState("");
  const [jsonResponse, setJsonResponse] = useState("");

  const router = useRouter();

  const { user } = useUser();
  const onSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    console.log(jobDesc, jobExperience, jobPosition);
    const inputPrompt = `Job Role : ${jobPosition} , Job Description / Tech Stack: ${jobDesc}, Years of Experience: ${jobExperience} .Depending on the above information give me ${process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT} interview questions with answers .The questions and answers must be in JSON format`;

    const result = await chatSession.sendMessage(inputPrompt);
    const MockJsonResp = result.response
      .text()
      .trim()
      .replace("```json", "")
      .replace("```", "");

    console.log(MockJsonResp);
    setJsonResponse(MockJsonResp);

    if (MockJsonResp) {
      const resp = await db
        .insert(MockInterview)
        .values({
          mockId: uuidv4(),
          jobDesc: jobDesc,
          jobExperience: jobExperience,
          jobPosition: jobPosition,
          jsonMockResp: MockJsonResp,
          createdBy: user.primaryEmailAddress?.emailAddress,
          createdAt: moment().format("DD-MM-YYYY"),
        })
        .returning({ mockId: MockInterview.mockId });
      console.log("Inserted Id", resp);
      if (resp) {
        setOpenDialog(false);
        router.push(`/dashboard/interview/${resp[0].mockId}`);
      }
    } else
      throw new Error("AI failed to generate response :(, Try after some time");
    setLoading(false);
  };
  return (
    <div>
      <div
        className="p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-sm transition-all"
        onClick={() => setOpenDialog(true)}
      >
        <h2 className=" text-center">+ Add New</h2>
      </div>
      <Dialog open={openDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Tell us more about your job interview</DialogTitle>
            <DialogDescription>
              <form onSubmit={onSubmit}>
                <div>
                  <h2>
                    Add details about your Job position/role, Job description
                    and years of experience
                  </h2>

                  <div className="mt-7 my-2">
                    <label htmlFor="role" className="p-1 ">
                      Job Role / Job Position{" "}
                      <span className="text-red-700">*</span>
                    </label>
                    <Input
                      placeholder="eg. Full Stack Developer"
                      id="role"
                      required
                      onChange={(e) => setJobPosition(e.target.value)}
                      value={jobPosition}
                    />
                  </div>

                  <div className="mt-7 my-2">
                    <label htmlFor="desc" className="p-1 ">
                      Job Description / Tech Stack (In Short){" "}
                      <span className="text-red-700">*</span>
                    </label>
                    <Textarea
                      placeholder="eg. ReactJs, AngularJs, NodeJs, MySQL etc"
                      id="desc"
                      required
                      onChange={(e) => setJobDesc(e.target.value)}
                      value={jobDesc}
                    />
                  </div>
                  <div className="mt-7 my-2">
                    <label htmlFor="exp" className="p-1 ">
                      Years of Experience{" "}
                      <span className="text-red-700">*</span>
                    </label>
                    <Input
                      placeholder="eg. 5"
                      id="exp"
                      type="number"
                      required
                      min="0"
                      max="50"
                      onChange={(e) => setJobExperience(e.target.value)}
                      value={jobExperience}
                    />
                  </div>
                </div>
                <div className="flex gap-4 justify-end">
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className=" animate-spin" />
                        "Generating from AI"
                      </>
                    ) : (
                      "Start Interview"
                    )}
                  </Button>
                  <div onClick={() => setOpenDialog(false)}>
                    <Button type="button" variant="ghost">
                      Cancel
                    </Button>
                  </div>
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddNewInterview;
