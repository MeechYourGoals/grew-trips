import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TripVariantProvider } from "@/contexts/TripVariantContext";
import { BasecampProvider } from "@/contexts/BasecampContext";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TooltipProvider>
      <TripVariantProvider variant="consumer">
        <BasecampProvider>
          <App />
        </BasecampProvider>
      </TripVariantProvider>
    </TooltipProvider>
  </StrictMode>,
);
