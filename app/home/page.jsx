"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function AboutPage() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("/portfolio");
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="container mx-auto pt-[80px] px-4 space-y-12">
        {/* Hero Section */}
        <section className="text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to Trade Buddy</h1>
          <p className="text-lg text-gray-600">
            Empowering investors with tools to manage their portfolios effectively.
          </p>
          <Button className="mt-6" onClick={handleGetStarted}>
            Get Started
          </Button>
        </section>

        <Separator />

        {/* Features Section */}
        <section>
          <h2 className="text-3xl font-semibold mb-6 text-center">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <h3 className="text-xl font-semibold">Portfolio Management</h3>
              <p className="text-gray-600 mt-2">
                Track your investments and view performance metrics.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-semibold">Stock Search</h3>
              <p className="text-gray-600 mt-2">
                Quickly find stocks and view market data.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-semibold">Alerts and Notifications</h3>
              <p className="text-gray-600 mt-2">
                Stay informed with real-time alerts and updates.
              </p>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Testimonials Section */}
        <section>
          <h2 className="text-3xl font-semibold mb-6 text-center">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <p className="text-gray-600">
                "Trade Buddy has completely changed the way I manage my portfolio.
                It's intuitive and incredibly useful."
              </p>
              <p className="mt-4 font-bold">— Jane Doe</p>
            </Card>
            <Card className="p-6">
              <p className="text-gray-600">
                "The stock search feature is a game-changer. It's fast and gives me
                all the details I need."
              </p>
              <p className="mt-4 font-bold">— John Smith</p>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Progress/Stats Section */}
        <section>
          <h2 className="text-3xl font-semibold mb-6 text-center">Our Progress</h2>
          <div className="space-y-6">
            <div>
              <p className="text-gray-600">User Satisfaction</p>
              <Progress value={90} className="mt-2" />
            </div>
            <div>
              <p className="text-gray-600">Feature Completion</p>
              <Progress value={75} className="mt-2" />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}