"use client";

import Link from "next/link";

export default function Disclaimer() {
  return (
    <main className="min-h-screen bg-black p-8">
      <div className="max-w-2xl mx-auto bg-black/50 p-6 border border-[#39ff14] rounded-lg backdrop-blur-sm">
        <h1 className="text-3xl text-[#39ff14] mb-6 toxic-shadow">
          DISCLAIMER
        </h1>

        <div className="space-y-4 text-gray-300">
          <p>
            This website is part of a fictional game experience. All content,
            including text, images, and interactions, is entirely fictional and
            created for entertainment purposes only.
          </p>

          <p>Please note:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>This is not a real marketplace or trading platform</li>
            <li>All characters, events, and scenarios are fictional</li>
            <li>No illegal activities are endorsed or promoted</li>
            <li>This is purely for entertainment and gaming purposes</li>
          </ul>

          <p>
            By using this website, you acknowledge that you understand its
            fictional nature and are engaging with it solely for entertainment
            purposes.
          </p>

          <br />

          <Link href="https://nopixel.fandom.com/wiki/Aubrey_Webster">
            🔗 Nopixel Wiki
          </Link>
        </div>

        <button
          onClick={() => window.history.back()}
          className="mt-8 px-4 py-2 bg-[#8b0000] hover:bg-[#39ff14] hover:text-black transition-colors duration-300 border border-[#39ff14] rounded"
        >
          RETURN
        </button>
      </div>
    </main>
  );
}
