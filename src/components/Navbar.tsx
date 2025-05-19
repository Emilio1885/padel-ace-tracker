
import React from 'react';
import { Button } from "@/components/ui/button";
import { ChartLineIcon, PlusIcon, UserIcon } from "@/components/Icons";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-padel-blue to-padel-green rounded-lg"></div>
          <h1 className="text-xl font-bold text-gray-900">PadelCoach</h1>
        </Link>
        
        <div className="hidden md:flex space-x-4">
          <Link to="/">
            <Button variant="ghost" className="flex items-center gap-2">
              <UserIcon className="w-4 h-4" />
              <span>Alumnos</span>
            </Button>
          </Link>
          <Button variant="ghost" className="flex items-center gap-2">
            <ChartLineIcon className="w-4 h-4" />
            <span>Estadísticas</span>
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Button onClick={() => navigate('/player/new')} className="flex items-center gap-2 bg-padel-green hover:bg-padel-green/90">
            <PlusIcon className="w-4 h-4" />
            <span>Nuevo Alumno</span>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
