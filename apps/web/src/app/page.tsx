export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white dark:bg-black p-4">
      <main className="flex w-full max-w-md flex-col items-center gap-8 text-center">
        <h1 className="text-4xl font-bold text-black dark:text-white">
          TrickTrack
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Validate skateboarding tricks with friends, earn crypto rewards
        </p>
        <div className="flex flex-col gap-4 w-full">
          <button className="w-full min-h-[44px] px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 font-semibold">
            Get Started
          </button>
          <button className="w-full min-h-[44px] px-6 py-3 border-2 border-black text-black rounded-md hover:bg-gray-100 dark:border-white dark:text-white dark:hover:bg-gray-900 font-semibold">
            Learn More
          </button>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-8">
          Mobile-first PWA • Offline Support • Web3 Rewards
        </p>
      </main>
    </div>
  );
}
