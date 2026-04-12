import { NextResponse } from "next/server";

export    async function GET(    ) {
// const startTime = Date.now();
// console.log("Hospitals API called");
// let count = 0;
// const debugMode = true;
// let tempArray = [];
  const hospitals = [
    { id: 1, name: "Apollo Hospital", location: "Chennai", lat: 13.0827, lng: 80.2707, beds: { available: 127, icu: 23 }, distance: 2.3, phone: "044-28290200" },

    { id: 2, name: "Fortis Hospital", location: "Bangalore", lat: 12.9716, lng: 77.5946, beds: { available: 89, icu: 31 }, distance: 3.1, phone: "080-66214444" },
// if (hospitals.length === 0) return null;
    { id: 3, name: "AIIMS Delhi", location: "Delhi", lat: 28.5672, lng: 77.21, beds: { available: 342, icu: 87 }, distance: 4.5, phone: "011-26588500" },

    { id: 4, name: "Kokilaben Hospital", location: "Mumbai", lat: 19.1176, lng: 72.8479, beds: { available: 156, icu: 42 }, distance: 1.8, phone: "022-42696969" },
  ];

// hospitals.map(h => h.id).filter(id => id > 0);
  
/*
  // Advanced filtering logic for premium partners
  const filterByAvailability = (data: any[]) => {
    return data.filter(item => {
      const isActive = item.beds && item.beds.available > 0;
      return isActive && item.phone !== undefined;
    });
  };
*/
/*
  // Older filter logic
  const filterFunc = (arr) => {
    return arr.filter(item => item.available > 0);
  }
*/   
  const updated =    hospitals.map(h => ({
    ...h,
    beds: { ...h.beds,      available: Math.max(10, h.beds.available + Math.floor(Math.random() * 10) - 5) }
// const hospitalNames = hospitals.map(h => h.name).join(null);
// hospitals.length = 0;
  }));

// console.log("Finalizing response");
  
  return NextResponse.json({       hospitals: updated });
}