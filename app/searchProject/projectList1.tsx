// projectList.tsx

// app/projects/projectList.tsx

'use client';
import Link from 'next/link';
import React, { useState, useEffect, useMemo } from 'react';
import { RxCross2 } from 'react-icons/rx';
import { useGlobalState } from '../../src/config/config';
import { Project, SearchResult } from '../../src/types';
import { useRouter } from 'next/router';
import { LuArrowUpRight } from 'react-icons/lu';
import Image from 'next/image';
import useLocalStorage from '@/src/hooks/use-local-storage-state';



interface Props {
  projects: Project[];
  query: string;
  filter: string;
  walletAddress: string;
  endpoint: string;
  sortOrder: string;
  searchResults: SearchResult[];
}

export default function ProjectList({ 
  projects,
  query,
  filter,
  walletAddress,
  endpoint,
  sortOrder,
  searchResults,
}: Props) {
    useEffect(() => {
        console.log("Received sortOrder in ProjectList:", sortOrder);
    }, [sortOrder]);

  const [selectedProject, setSelectedProject] = useLocalStorage<Project | null>(
    'selectedProject', null
  );
  const [selectedProjectName, setSelectedProjectName] = useGlobalState('selectedProjectName');
  const [modalOpen, setModalOpen] = useState(false);
  

  const filteredProjects = query
  ? projects.filter((project) => {
      if (filter === 'projectName') {
        return (project.projectName?.toLowerCase() || '').includes(query.toLowerCase());
      } else if (filter === 'most-engaged') {
        // Filter projects based on the Farcaster social graph data
        return Array.isArray(searchResults) && searchResults.length > 0 && searchResults.some((result) => result.fid === project.userFid);
      } else if (filter === 'recently-added') {
        // Filter projects based on the creation date (assuming you have a createdAt field)
        // Modify this logic based on your specific requirements
        return (project?.createdAt || '') >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // Last 7 days
      }
      return false;
    })
  : projects;

  const sortedProjects = useMemo(() => {
  console.log("Sorting with sortOrder:", sortOrder);
  return filteredProjects.sort((a, b) => {
    if (sortOrder === 'asc') {
      return (a.projectName || '').localeCompare(b.projectName || '', undefined, { sensitivity: 'base' });
    } else if (sortOrder === 'desc') {
      return (b.projectName || '').localeCompare(a.projectName || '', undefined, { sensitivity: 'base' });
    }
    return 0;
  });
}, [filteredProjects, sortOrder]);



  const openModal = (project: Project) => {
    console.log('Opening modal for project:', project);
    setSelectedProject(project);
    setSelectedProjectName(project.projectName);
    setModalOpen(true);
  };

  const closeModal = () => {
    // setSelectedProject(null);
    // setSelectedProjectName('');
    setModalOpen(false);
  };

  const urlHelper = (url: string) => {
    if (!url.match(/^https?:\/\//)) {
      return `https://${url}`;
    }
    return url;
  };

  const checkwebsiteUrl = urlHelper(selectedProject?.websiteUrl || '');

  const renderModal = () => {
    if (!modalOpen || !selectedProject) return null;

    console.log("Rendering modal with Selected Project", selectedProject);
    console.log("Rendering modal with Selected Project Name", selectedProjectName);

    return (
      <div className="fixed inset-0 bg-white bg-opacity-50 flex justify-center items-center">
        <div
          className="relative m-auto p-8 bg-white rounded-lg shadow-lg max-w-4xl w-1/4 max-h-[90vh] overflow-y-auto mx-4 md:mx-20"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-center pt-8 p-2">
              <h2 className="text-xl font-bold mb-4">{selectedProject.projectName}</h2>
            </div>
          <hr className="border-1 border-gray-300 my-2 mx-auto w-1/2" />
          
          <div className="mb-4 items-center py-3">
            <h3 className="font-semibold text-center">Description</h3>
            <p className="text-center">{selectedProject.oneliner}</p>
          </div>
          
          <div className="mb-4">
            <h3 className="font-semibold text-center">Website</h3>
            <p className="text-center overflow-wrap break-words max-w-full mx-auto truncate">
              {selectedProject.websiteUrl   && (
                <Link href={`${checkwebsiteUrl}`}>
                  <p className="text-blacl hover:text-gray-300 visited:text-indigo-600 ">
                  {selectedProject.websiteUrl}
                  </p>
                </Link>
              )}
            </p>
            </div>
          <div className="mb-4">
            <h3 className="font-semibold text-center">Twitter</h3>
            <p className="text-center">
            {selectedProject.twitterUrl && (
              <a href={selectedProject.twitterUrl} target="_blank" rel="noopener noreferrer">
                {selectedProject.twitterUrl}
              </a>
            )}
            </p>
          </div>
          <div className="mb-4">
            <h3 className="font-semibold text-center">Github</h3>
            <p className="text-center">
            {selectedProject.githubUrl && (
              <a href={selectedProject.githubUrl} target="_blank" rel="noopener noreferrer">
                {selectedProject.githubUrl}
              </a>
            )}
            </p>
          </div>
          <div className="mb-4 text-center">
            {/* //if the project name isnot in the database this does not work */}
            {/* there must be a waay to fix this */}
            <Link href={`/projects/${encodeURIComponent(selectedProject.projectName)}`}>
              <button 
                className='btn'
                >
                  View Contributions
              </button>
            </Link>
          </div>
          <button onClick={closeModal} className="text-black absolute top-0 right-0 w-5 h-5 mt-4 mr-4">
            <RxCross2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className=" bg-white">
      <div className="grid grid-cols-4 gap-12 mx-auto max-w-6xl overflow-y-auto">
        
        {sortedProjects.map((project) => (
          <div
            key={project.id}
            className="flex flex-col p-6 border justify-center items-center bg-white text-black border-gray-300 rounded-md w-full h-60 shadow-xl"
            onClick={() => {
              console.log('clicked project:', project);
              openModal(project);
            }}
          >
            <div className="rounded-md bg-gray-300 w-24 h-24 flex items-center justify-center overflow-hidden mb-4">
              {project.logoUrl ? (
                <Image
                  src={project.logoUrl}
                  alt="Project Logo"
                  width={64}
                  height={64}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="flex items-center justify-center text-gray-500">
                  {/* Add optional placeholder content if needed */}
                 
                </div>
              )}
            </div>  
            <h3 className="mb-2 text-xl font-semibold">{project.projectName}</h3>
            <p className="mb-2 text-md text-gray-500">{project.oneliner}</p>
            {/* Display the username if available */}
            {Array.isArray(searchResults) && searchResults.find((result) => result.fid === project.userFid)?.username && (
              <p className="text-gray-500">
                {searchResults.find((result) => result.fid === project.userFid)?.username}
              </p>
            )}
          </div>
        ))}
      </div>
    
      
      {renderModal()}
  </div>
  );
}