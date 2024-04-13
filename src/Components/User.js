import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { FaFolder, FaThumbsUp } from 'react-icons/fa';

const User = ({ projectId }) => {
  const [selectedDomain, setSelectedDomain] = useState('');
  const [domains, setDomains] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [likes, setLikes] = useState({});
  const [id,setId]=useState(null);
  const [cmnts,setCmnts]=useState([]);
  const [cmntcount, setCmntcount]=useState(0);
  const [usercmnt,setUsercmnt]=useState("");
  useEffect(() => {
    const fetchDomains = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/domains', {
  credentials: 'include'
});
const data = await response.json();
        setDomains(data.domains);
        setId(data.id);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching domains:', error);
        setLoading(false);
      }
    };
  
    fetchDomains();
    
    
    setIsLiked(getIsLiked(projectId)); 
    // Pass projectId to fetchLikesCount
    if (projectId) {
      fetchLikesCount(projectId);
      
    }
  
  }, [projectId]); // Add projectId to the dependency array of useEffect

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
    setIsLiked(project.likes.some(like => like === id));
  
    setLikesCount(project.likes.length);
    setCmntcount(project.comments.length);
    setCmnts(project.comments);
  
    // Check if the user has a comment in the project's comments
    const userHasComment = project.comments.some(comment => comment.postedBy === id);
    if (userHasComment) {
      // Find the user's comment
      const userComment = project.comments.find(comment => comment.postedBy === id);
      setUsercmnt(userComment.text);
    } else {
      // Clear user's comment if not found
      setUsercmnt("");
    }
  };
  

  const fetchLikesCount = async (projectId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/project/likes/${selectedProject._id}`);
      setLikesCount(response.data.likesCount);
    } catch (error) {
      console.error('Error fetching likes count:', error);
    }
  };

  const handleLike = async () => {
  try {
    const response = await axios.put(
      'http://localhost:5000/api/project/like',
      { projectId: selectedProject._id },
      { withCredentials: true }
    );
    if (response.status === 200) {
      const newIsLiked = !isLiked;
      setIsLiked(newIsLiked);
      // Toggle like status
      localStorage.setItem(projectId, newIsLiked ? 'liked' : 'not-liked');
      console.log("is liked ",newIsLiked);
      // Update likes count immediately
      setLikesCount( newIsLiked ? likesCount + 1 : likesCount - 1);
    }
  } catch (error) {
    console.error('Error liking project:', error);
  }
};

  const getIsLiked = (projectId) => {
    return localStorage.getItem(projectId) === 'liked';
  };
  const handleCommentChange = (e) => {
    setUsercmnt(e.target.value);
  };
  const handleSubmitComment= async () => {
    const res=await axios.put(
      'http://localhost:5000/api/project/Coment',
      { projectId: selectedProject._id ,text:usercmnt},
      { withCredentials: true }
    );
    if(res.status==200){
    alert("Comment added successfully ");
    setCmntcount(cmntcount+1);  
  }
   else
   alert("Something went wrong");

  }

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
                    <FaThumbsUp /> {isLiked ? 'Unlike' : 'Like'}
                  </button>
                  <span>Likes: {likesCount}</span>
                </div>
                <div>
                  <span>Comments : {cmntcount}</span>
                     <div>
                        <textarea
                          value={usercmnt}
                          onChange={handleCommentChange}
                          placeholder="Write your comment..."
                          rows={4}
                          cols={50}
                        />
                        <button onClick={handleSubmitComment}>Submit</button>

                        {/* Displaying all comments */}
                        <div>
                          {cmntcount !== 0 && cmnts.map((comment, index) => (
                                  comment.postedBy !== id ? (
                                    <div key={index}>
                                      <p>{comment.text}</p>
                                      <p>Posted by: {comment.postedBy}</p>
                                    </div>
                                  ) : (<div></div>)
                                ))}
                        </div>
                      </div>
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
