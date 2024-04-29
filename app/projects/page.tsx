'use client';
import Image from "next/image";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import Sidebar from "./sidebar1";
import ProfilePage from "./profilepage1";
import { SetStateAction, useState } from "react";
import { useGlobalState } from "@/src/config/config";
import { Project} from '@/src/types';


export default function Projects() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useGlobalState('selectedProject');

  // Function to toggle the sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        {selectedProject && (
          <Sidebar isOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} project={selectedProject} />
        )}
        <main className="flex-1 overflow-auto">
        </main>
      </div>
      <Footer />
    </div>
  );
}