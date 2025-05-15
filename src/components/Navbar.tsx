
import React from 'react';
import { Button } from "@/components/ui/button";
import { CalendarIcon, ChartLineIcon, UserIcon, LogOut } from "@/components/Icons";
import { useSecurity } from '@/context/SecurityContext';
import { Link } from 'react-router-dom';
import AddMatchForm from './AddMatchForm';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Navbar: React.FC = () => {
  const { user, profile, signOut } = useSecurity();
  
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-padel-blue to-padel-green rounded-lg"></div>
          <h1 className="text-xl font-bold text-gray-900">PadelTracker</h1>
        </Link>
        
        {user ? (
          <>
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
            
            <div className="flex items-center gap-2">
              <div className="mr-2 hidden md:inline-flex">
                <AddMatchForm />
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="rounded-full h-10 w-10 p-0">
                    <Avatar>
                      <AvatarImage src={profile?.image || undefined} />
                      <AvatarFallback>{profile?.name?.charAt(0) || user.email?.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="cursor-pointer">
                    Mi Perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" onClick={() => signOut()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Cerrar Sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <div className="md:hidden">
                <AddMatchForm />
              </div>
            </div>
          </>
        ) : (
          <Link to="/login">
            <Button>Iniciar Sesión</Button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
