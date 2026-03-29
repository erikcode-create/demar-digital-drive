import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, FileText, ArrowRight } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[hsl(225_97%_4%)] relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
        backgroundSize: '40px 40px',
      }} />
      <div className="text-center px-4 max-w-lg mx-auto relative z-10">
        <img
          src="/demar-logo-official.png"
          alt="DeMar Transportation"
          className="h-14 mx-auto mb-10"
        />
        <div className="text-8xl font-bold text-[hsl(var(--accent))] tracking-tight mb-4">
          404
        </div>
        <h2 className="text-2xl font-semibold text-white mb-3 tracking-tight">
          Page Not Found
        </h2>
        <p className="text-base text-white/40 mb-10">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="hero" size="lg" asChild>
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Return Home
            </Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="bg-white/5 border-white/20 text-white hover:bg-white/10"
            asChild
          >
            <Link to="/quote" className="group">
              <FileText className="mr-2 h-4 w-4" />
              Request a Quote
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
