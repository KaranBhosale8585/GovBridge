"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowLeftCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-screen bg-white text-black px-4">
      <div className="text-center max-w-md space-y-6">
        <div className="flex justify-center">
          <AlertTriangle size={64} className="text-yellow-500 animate-pulse" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight">
          Hold it right there! 🛑
        </h1>
        <p className="text-gray-700 text-lg">
          Looks like you tried accessing a restricted page, but you're not on
          the VIP guest list... 😅
        </p>
        <p className="text-sm text-gray-600 italic">
          You can report issues like <strong>Garbage</strong>,{" "}
          <strong>Road Damage</strong>, <strong>Electricity</strong>,{" "}
          <strong>Water</strong>, and <strong>Other</strong> — but only admins
          can see the backstage drama.
        </p>

        <div className="flex flex-col items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="border-black text-black hover:bg-black hover:text-white transition cursor-pointer"
          >
            <ArrowLeftCircle className="mr-2 h-5 w-5" />
            Go Back
          </Button>

          <div className="text-gray-400 text-xs">
            If you think this is a mistake, blame the admin. Not us 🙃
          </div>
        </div>
      </div>
    </div>
  );
}
