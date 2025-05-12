
import React from 'react';
import { Button } from "@/components/ui/button";
import { CalendarIcon, ChartLineIcon, UserIcon } from "@/components/Icons";

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-padel-blue to-padel-green rounded-lg"></div>
          <h1 className="text-xl font-bold text-gray-900">PadelTracker</h1>
        </div>
        
        <div className="hidden md:flex space-x-4">
          <Button variant="ghost" className="flex items-center gap-2">
            <UserIcon className="w-4 h-4" />
            <span>Perfil</span>
          </Button>
          <Button variant="ghost" className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4" />
            <span>Partidos</span>
          </Button>
          <Button variant="ghost" className="flex items-center gap-2">
            <ChartLineIcon className="w-4 h-4" />
            <span>Estadísticas</span>
          </Button>
        </div>
        
        <div>
          <Button variant="outline" className="mr-2 hidden md:inline-flex">Añadir partido</Button>
          <Button>
            <span className="md:hidden">+</span>
            <span className="hidden md:inline">Nuevo partido</span>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
