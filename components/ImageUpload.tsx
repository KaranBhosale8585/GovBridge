"use client";

import { UploadButton } from "@/utils/uploadthing";
import { UploadCloud } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-white text-black">
      <div className="text-center space-y-4">
        <h1 className="text-xl font-semibold">Upload your media</h1>

        <UploadButton
          endpoint="imageUploader"
          appearance={{
            button:
              "flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-900 transition",
            container: "flex flex-col items-center justify-center",
          }}
          content={{
            button({ isUploading }) {
              return (
                <>
                  <UploadCloud className="w-4 h-4" />
                  {isUploading ? "Uploading..." : "Upload File"}
                </>
              );
            },
          }}
          onClientUploadComplete={(res) => {
            console.log("Files: ", res);
            alert("Upload Completed");
          }}
          onUploadError={(error: Error) => {
            alert(`ERROR! ${error.message}`);
          }}
        />
      </div>
    </main>
  );
}
