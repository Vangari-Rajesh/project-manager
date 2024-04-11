import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { FaFolder, FaThumbsUp } from 'react-icons/fa';

const User = () => {
  const [selectedDomain, setSelectedDomain] = useState('');
  const [domains, setDomains] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [likes, setLikes] = useState({});

  useEffect(() => {
    const fetchDomains = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/domains');
        const data = await response.json();
        setDomains(data.domains);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching domains:', error);
        setLoading(false);
      }
    };

    fetchDomains();
  }, []);

  const handleDomainChange = (e) => {
    setSelectedDomain(e.target.value);
  };

  const handleViewProjects = async () => {
    if (selectedDomain === '') {
      alert('Please select a domain.');
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/project?domain=${selectedDomain}`);
      const data = await response.json();
      if (data.project.length === 0) {
        alert("No projects are present as of now.");
      }
      setProjects(data.project);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setLoading(false);
    }
  };

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    setLikes(prevLikes => ({
      ...prevLikes,
      [project.projectName]: project.likes ? project.likes.length : 0
    }));
  };

  const handleLike = async () => {
    try {
      setLoading(true);
      const response = await axios.put(
        'http://localhost:5000/api/project/like',
        { projectId: selectedProject._id },
        { withCredentials: true }
      );
      if (response.status !== 200) {
        throw new Error('Failed to like project');
      }
      setLikes(prevLikes => ({
        ...prevLikes,
        [selectedProject.projectName]: (prevLikes[selectedProject.projectName] || 0) + 1
      }));
    } catch (error) {
      console.error('Error liking project:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <div className="row">
          <div className="col-md-6 d-flex justify-content-end align-items-center">
            <select className="form-select me-2 mb-3" value={selectedDomain} onChange={handleDomainChange}>
              <option value="">Select Domain</option>
              {domains.map((domain) => (
                <option key={domain._id} value={domain.domainName}>{domain.domainName}</option>
              ))}
            </select>
            <button className="btn btn-primary" onClick={handleViewProjects} style={{ backgroundColor: '#4caf50', border: 'none' }}>
              {loading ? 'Loading...' : 'View Projects'}
            </button>
          </div>
        </div>
        {projects.length > 0 && (
          <div className="row mt-4">
            <div className="col-md-12">
              <h3>Projects under {selectedDomain}</h3>
              <ul className="list-group">
                {projects.map((project) => (
                  <li key={project._id} className="list-group-item">
                    <FaFolder style={{ marginRight: '0.5rem', cursor: 'pointer' }} onClick={() => handleProjectClick(project)} />
                    {project.projectName}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
      {selectedProject && (
        <div className="modal" tabIndex="-1" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)', position: 'fixed', top: 0, bottom: 0, left: 0, right: 0 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedProject.projectName}</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={() => setSelectedProject(null)}></button>
              </div>
              <div className="modal-body">
                <p><strong>Domain:</strong> {selectedProject.domain}</p>
                <p><strong>Description:</strong> {selectedProject.description}</p>
                <div className="mb-3">
                  <button type="button" className="btn btn-outline-primary me-2" onClick={handleLike}>
                    <FaThumbsUp /> Like ({likes[selectedProject.projectName] || 0})
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default User;
