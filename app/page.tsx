'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, MapPin, Clock, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Navbar */}
      <nav className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Heart className="w-8 h-8 text-red-500" />
            <span className="text-2xl font-bold">MediTrack+</span>
          </div>
          <div className="flex gap-6 text-sm">
            <a href="#" className="hover:text-blue-400 transition-colors">For Patients</a>
            <a href="#" className="hover:text-blue-400 transition-colors">For Hospitals</a>
            <a href="#" className="hover:text-blue-400 transition-colors">AI Checker</a>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-16 max-w-6xl mx-auto px-6 text-center">
        <h1 className="text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
          Find the Right Hospital.<br />In Seconds.
        </h1>
        <p className="text-2xl text-zinc-400 max-w-2xl mx-auto">
          Real-time bed availability + AI symptom analysis + Smart routing
        </p>

        <div className="mt-10 flex justify-center gap-4">
          <Button size="lg" className="text-lg px-10 py-7 rounded-2xl bg-blue-600 hover:bg-blue-700">
            Try AI Symptom Checker →
          </Button>
          <Button size="lg" variant="outline" className="text-lg px-10 py-7 rounded-2xl border-zinc-700 hover:bg-zinc-900">
            See Live Hospitals
          </Button>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-zinc-900 border-zinc-800 hover:border-blue-500 transition-all hospital-card">
            <CardHeader>
              <MapPin className="w-10 h-10 text-blue-500 mb-4" />
              <CardTitle>Live Hospital Map</CardTitle>
            </CardHeader>
            <CardContent className="text-zinc-400">
              See real-time available beds, ICU, and waiting time near you.
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800 hover:border-red-500 transition-all hospital-card">
            <CardHeader>
              <Heart className="w-10 h-10 text-red-500 mb-4" />
              <CardTitle>AI Urgency Detector</CardTitle>
            </CardHeader>
            <CardContent className="text-zinc-400">
              Enter symptoms → Get urgency level + best hospital suggestion.
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800 hover:border-emerald-500 transition-all hospital-card">
            <CardHeader>
              <Users className="w-10 h-10 text-emerald-500 mb-4" />
              <CardTitle>Smart Patient Routing</CardTitle>
            </CardHeader>
            <CardContent className="text-zinc-400">
              Never go to a full hospital again. We guide you to the right one.
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}