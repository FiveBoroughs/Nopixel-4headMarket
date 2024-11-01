"use client";
import { useState, useEffect } from 'react';
import { Skull, Shield } from 'lucide-react';

export default function Header() {
  const [randomName, setRandomName] = useState("*****");

  useEffect(() => {
    const names = ["4HEAD", "TUBBY", "FATTY", "DRAKE#1FANBOY","xX_DAFINGUS_Xx", "BALDIE", "SOUTHSIDE TEDDYBEAR", "MYMAN_MYMAN", "*****", "JAMESON ELIZABETH PITTS SOZE"]
    setRandomName(names[Math.floor(Math.random() * names.length)]);
  }, []);

  return (
    <div className="sticky top-0 z-50 bg-black/90 border-b border-[#39ff14] backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skull className="w-8 h-8 text-[#39ff14]" />
            <h1 className="text-2xl text-[#39ff14] toxic-shadow">{randomName}&apos;S MARKET</h1>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#8b0000]" />
            <span className="text-[#8b0000] text-sm">BROWSE AT YOUR OWN RISK</span>
          </div>
        </div>
      </div>
    </div>
  );
}