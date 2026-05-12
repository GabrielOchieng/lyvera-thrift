"use client";

export default function OfflinePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F3F4F6] px-4 text-center">
      <h1 className="text-3xl font-bold text-maroon-primary mb-4">
        You're Offline
      </h1>
      <p className="text-gray-600 mb-8">
        It looks like you've lost your connection. You can still browse
        previously viewed items, or check back once you're back in a high-signal
        area in Nairobi!
      </p>
      <button
        onClick={() => window.location.reload()}
        className="bg-maroon-primary text-white px-6 py-2 rounded-md uppercase tracking-widest text-sm"
      >
        Retry Connection
      </button>
    </div>
  );
}
