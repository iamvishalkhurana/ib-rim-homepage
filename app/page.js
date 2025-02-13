// import { Button } from "@/components/ui/button";
import { auth, currentUser } from "@clerk/nextjs/server";
// export default function Home() {
//   const router = useRouter();
//   useEffect(() => {
//     router.replace("/dashboard");
//   }, []);
//   return (
//     <div className="h-[100vh] flex flex-col gap-10 justify-center items-center">
//       <h1>Not A Page to Visit</h1>
//       <Button>Lets Go Back to Dashboard </Button>
//     </div>
//   );
// }

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CheckCircle, Mic, Brain, Users } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <section className="text-center py-20 bg-blue-600 text-white">
        <h1 className="text-5xl font-bold mb-4">Ace Your Next Interview</h1>
        <p className="text-lg mb-6">
          Practice with AI-powered mock interviews and get instant feedback.
        </p>
        <Button className="bg-white text-blue-600 px-6 py-3 rounded-xl shadow-lg hover:bg-gray-200">
          <Link href={currentUser ? "/dashboard" : "/sign-in"}>
            Start Practicing
          </Link>
        </Button>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 max-w-5xl mx-auto">
        <h2 className="text-3xl font-semibold text-center mb-8">
          Key Features
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center text-center"
              whileHover={{ scale: 1.05 }}
            >
              <feature.icon size={40} className="text-blue-600 mb-3" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

const features = [
  {
    icon: Mic,
    title: "Realistic Interviews",
    description: "AI-generated questions tailored to your domain.",
  },
  {
    icon: Brain,
    title: "Instant Feedback",
    description: "Get AI-powered insights on your performance.",
  },
  {
    icon: CheckCircle,
    title: "Track Progress",
    description: "Monitor your improvement over time.",
  },
];
