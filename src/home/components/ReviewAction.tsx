import React from "react";

const ReviewAction: React.FC = () => (
  <section className="bg-blue-600 py-10 flex justify-center items-center">
    <button className="flex items-center justify-center w-full max-w-xl px-8 py-5 rounded-full border-2 border-white text-white text-lg font-medium bg-blue-600 hover:bg-blue-700 transition">
      <svg
        className="w-6 h-6 mr-3"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a4 4 0 01-1.414.94l-4.243 1.415 1.415-4.243a4 4 0 01.94-1.414z"
        />
      </svg>
      Berikan ulasan anda!
    </button>
  </section>
);

export default ReviewAction;
