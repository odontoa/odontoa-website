import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const goToHome = () => {
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <nav className="w-full border-b border-[#262626] sticky top-0 z-50 bg-black">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button onClick={goToHome} className="flex items-center">
              <img 
                src="/odontoa-logo1.png" 
                alt="Odontoa Logo" 
                className="h-8 w-auto mr-3"
              />
              <div className="text-white font-bold text-xl">Odontoa</div>
            </button>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={goToHome}
              className="text-white hover:text-[#4a9489] transition-colors text-sm font-medium"
            >
              Početna
            </button>
            <button 
              onClick={() => navigate('/o-nama')}
              className="text-white hover:text-[#4a9489] transition-colors text-sm font-medium"
            >
              O nama
            </button>
            <button 
              onClick={() => navigate('/kontakt')}
              className="text-white hover:text-[#4a9489] transition-colors text-sm font-medium"
            >
              Kontakt
            </button>
            <button 
              onClick={() => navigate('/blogovi')}
              className="text-white hover:text-[#4a9489] transition-colors text-sm font-medium"
            >
              Blogovi
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-[#4a9489] transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
          
          <div className="hidden md:flex items-center space-x-3">
            <Button variant="outline" size="sm" className="bg-[#1976D2] border border-[#1976D2] text-[#FFFFFF] hover:bg-[#1565C0] transition-colors duration-200 shadow-sm" style={{borderRadius: '8px'}}>
              Uloguj se
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-[#262626] py-4">
            <div className="flex flex-col space-y-4">
              <button 
                onClick={goToHome}
                className="text-white hover:text-[#4a9489] transition-colors text-sm font-medium text-left"
              >
                Početna
              </button>
              <button 
                onClick={() => { navigate('/o-nama'); setIsMenuOpen(false); }}
                className="text-white hover:text-[#4a9489] transition-colors text-sm font-medium text-left"
              >
                O nama
              </button>
              <button 
                onClick={() => { navigate('/kontakt'); setIsMenuOpen(false); }}
                className="text-white hover:text-[#4a9489] transition-colors text-sm font-medium text-left"
              >
                Kontakt
              </button>
              <button 
                onClick={() => { navigate('/blogovi'); setIsMenuOpen(false); }}
                className="text-white hover:text-[#4a9489] transition-colors text-sm font-medium text-left"
              >
                Blogovi
              </button>
              <Button variant="outline" size="sm" className="bg-[#1976D2] border border-[#1976D2] text-[#FFFFFF] hover:bg-[#1565C0] transition-colors duration-200 shadow-sm w-fit" style={{borderRadius: '8px'}}>
                Uloguj se
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;