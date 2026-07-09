import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch, Router as WouterRouter } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import CharacterPad from "./pages/CharacterPad";
import Kiddiwear from "./pages/Kiddiwear";
import WireframePrototyper from "./pages/WireframePrototyper";
import NotFound from "./pages/NotFound";

function Router() {
  return (
    <WouterRouter>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/character-pad" component={CharacterPad} />
        <Route path="/kiddiwear" component={Kiddiwear} />
        <Route path="/wireframe-prototyper" component={WireframePrototyper} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </WouterRouter>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
