import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TOCItem {
  id: string;
  title: string;
  level: number;
}

interface TableOfContentsProps {
  items: TOCItem[];
}

export default function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Intersection Observer for active section highlighting
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-20% 0px -80% 0px", // Trigger when section is in top 20% of viewport
      }
    );

    // Observe all sections
    items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [items]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setIsOpen(false); // Close mobile menu after click
    }
  };

  return (
    <>
      {/* Mobile: Collapsible TOC */}
      <div className="lg:hidden mb-8">
        <Button
          variant="outline"
          className="w-full justify-between"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="font-semibold">Inhaltsverzeichnis</span>
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>

        {isOpen && (
          <div className="mt-4 p-4 border rounded-lg bg-slate-50">
            <nav className="space-y-2">
              {items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`block w-full text-left text-sm py-2 px-3 rounded transition-colors ${
                    activeId === item.id
                      ? "bg-blue-100 text-blue-900 font-semibold"
                      : "text-slate-700 hover:bg-slate-100"
                  } ${item.level === 3 ? "pl-6 text-xs" : ""}`}
                >
                  {item.title}
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>

      {/* Desktop: Sticky Sidebar TOC */}
      <div className="hidden lg:block">
        <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
          <div className="p-6 border rounded-lg bg-white shadow-sm">
            <h3 className="text-lg font-bold mb-4 text-slate-900">Inhaltsverzeichnis</h3>
            <nav className="space-y-2">
              {items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`block w-full text-left text-sm py-2 px-3 rounded transition-all ${
                    activeId === item.id
                      ? "bg-blue-100 text-blue-900 font-semibold border-l-4 border-blue-600"
                      : "text-slate-700 hover:bg-slate-50 border-l-4 border-transparent"
                  } ${item.level === 3 ? "pl-6 text-xs" : ""}`}
                >
                  {item.title}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}
