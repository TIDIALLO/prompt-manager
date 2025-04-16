// app/prompts/page.tsx
import { Header } from "@/components/header"; // Import shared header
import { PromptsGrid } from "./_components/prompts-grid";

// Import the Prompt type
import type { Prompt } from "./_components/prompts-types";

// Opt out of caching
export const dynamic = "force-dynamic";

// This page component is a Server Component by default.
// We will fetch data here later.
export default async function PromptsPage() {
  // Placeholder for where data fetching will occur
  const temporaryMockPrompts: Prompt[] = []; // Pass empty array for now

  return (
    <>
      <Header /> {/* Render the consistent header */}
      {/* Main content container */}
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-24 pb-16">
        {/* Add sufficient top padding (pt-24) below the fixed header */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page title */}
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            My Prompts
          </h1>

          {/* Delegate rendering the grid to a specialized component */}
          {/* Pass mock/empty data initially */}
          <PromptsGrid initialPrompts={temporaryMockPrompts} />
        </div>
      </div>
    </>
  );
}