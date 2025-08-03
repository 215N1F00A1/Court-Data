// src/App.tsx
import React from "react";
import { Toaster as RadixToaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Initialize React Query client
const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {/* Global toasters */}
        <RadixToaster />
        <SonnerToaster />

        <BrowserRouter>
          <Routes>
            {/* Home / Search page */}
            <Route path="/" element={<Index />} />

            {/* TODO: add additional routes here, for example:
              <Route path="/results" element={<Results />} />
              <Route path="/case/:caseId" element={<CaseDetails />} />
            */}

            {/* Catch-all for 404s */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
