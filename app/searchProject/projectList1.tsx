// projectList.tsx

// app/projects/projectList.tsx

'use client';
import Link from 'next/link';
import React, { useState } from 'react';
import { RxCross2 } from 'react-icons/rx';
import { useGlobalState } from '../../src/config/config';
import { Project } from '../../src/types';



interface Props {
  projects: Project[];
  query: string;
  filter: string;
  walletAddress: string;
  endpoint: string;
}

export default function ProjectList({ projects, query, filter, walletAddress, endpoint }: Props) {
  const [selectedProject, setSelectedProject] = useGlobalState('selectedProject');
  const [selectedProjectName, setSelectedProjectName] = useGlobalState('selectedProjectName');

  // Placeholder data for projects
//   const projects: Project[] = [
//     { id: 1, name: 'Project #1', website: 'https://project1.com', twitterUrl: 'https://twitter.com/project1' },
//     { id: 2, name: 'Project #2', website: 'https://project2.com', twitterUrl: 'https://twitter.com/project2' },
//     // Add more projects as needed
//   ];

    const filteredProjects = query
    ? projects.filter((project) => {
        if (filter === 'projectName') {
        return (project.projectName?.toLowerCase() || '').includes(query.toLowerCase());
        } else if (filter === 'ethAddress') {
        return (project.ethAddress?.toLowerCase() || '').includes(query.toLowerCase());
        }
        return false;
    })
    : projects;

  const openModal = (project: Project) => {
    console.log('Opening modal for project:', project);
    setSelectedProject(project);
    setSelectedProjectName(project.projectName);
  };

  const closeModal = () => {
    setSelectedProject(null);
    setSelectedProjectName('');
  };

  const renderModal = () => {
    if (!selectedProject) return null;

    console.log("Rendering modal with Selected Project", selectedProject);
    console.log("Rendering modal with Selected Project Name", selectedProjectName);

    return (
      <div className="fixed inset-0 bg-white bg-opacity-50 flex justify-center items-center">
        <div
          className="relative m-auto p-8 bg-white rounded-lg shadow-lg max-w-4xl w-1/4 h-1/2 mx-4 md:mx-20"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-center pt-8 p-2">
              <h2 className="text-xl font-bold mb-4">{selectedProject.projectName}</h2>
            </div>
          <hr className="border-1 border-gray-300 my-2 mx-auto w-1/2" />
          <div className="mb-4 items-center py-3">
            <h3 className="font-semibold text-center">Website</h3>
            <p className="text-center">
              {selectedProject.websiteUrl   && (
                <a href={selectedProject.websiteUrl} target="_blank" rel="noopener noreferrer">
                {selectedProject.websiteUrl}
                </a>
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
    <div className="p-6 bg-white">
      <div className="grid grid-cols-3 gap-12">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="flex flex-col p-6 border justify-center items-center bg-white text-black border-gray-300 rounded-xl w-full h-60 shadow-lg"
            onClick={() => {
              console.log('clicked project:', project);
              openModal(project)}}
          >
            <h3 className="mb-2 text-xl font-semibold">{project.projectName}</h3>
          </div>
        ))}
      </div>
      {renderModal()}
    </div>
  );
}