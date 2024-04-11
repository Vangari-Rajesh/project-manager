// import React, { useState, useEffect } from 'react';
// import Navbar from './Navbar';
// import axios from 'axios';
// import { FaFolder, FaThumbsUp, FaComment } from 'react-icons/fa'; // Import icons from Font Awesome

// const User = () => {
//   const [selectedDomain, setSelectedDomain] = useState('');
//   const [domains, setDomains] = useState([]);
//   const [projects, setProjects] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [selectedProject, setSelectedProject] = useState(null);
//   const [likes, setLikes] = useState({});
//   const [comments, setComments] = useState({});
//   const [commentInput, setCommentInput] = useState('');
//   const [nameInput, setNameInput] = useState('');

//   useEffect(() => {
//     const fetchDomains = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get('http://localhost:5000/api/domains');
//         setDomains(response.data.domains);
//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching domains:', error);
//         setLoading(false);
//       }
//     };

//     fetchDomains();
//   }, []);

//   const handleDomainChange = (e) => {
//     setSelectedDomain(e.target.value);
//   };

//   const handleViewProjects = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(`http://localhost:5000/api/projects?domain=${selectedDomain}`);
//       setProjects(response.data.projects);
//       setLoading(false);
//     } catch (error) {
//       console.error('Error fetching projects:', error);
//       setLoading(false);
//     }
//   };

//   const handleProjectClick = (project) => {
//     setSelectedProject(project);
//     setLikes((prevLikes) => ({
//       ...prevLikes,
//       [project._id]: prevLikes[project._id] ? prevLikes[project._id] : 0,
//     }));
//     setComments((prevComments) => ({
//       ...prevComments,
//       [project._id]: prevComments[project._id] ? prevComments[project._id] : [],
//     }));
//   };

//   const handleCloseModal = () => {
//     setSelectedProject(null);
//   };

//   const handleLike = () => {
//     setLikes((prevLikes) => ({
//       ...prevLikes,
//       [selectedProject._id]: prevLikes[selectedProject._id] + 1,
//     }));
//   };

//   const handleCommentInput = (e) => {
//     setCommentInput(e.target.value);
//   };

//   const handleNameInput = (e) => {
//     setNameInput(e.target.value);
//   };

//   const handleAddComment = () => {
//     const newComment = `${nameInput}: ${commentInput}`;
//     setComments((prevComments) => ({
//       ...prevComments,
//       [selectedProject._id]: [...prevComments[selectedProject._id], newComment],
//     }));
//     setCommentInput('');
//     setNameInput('');
//   };

  

//   return (
//     <div>
//       <Navbar />
//       <div className="container mt-4">
//         <div className="row">
//           <div className="col-md-6 d-flex justify-content-end align-items-center">
//             <select className="form-select me-2 mb-3" value={selectedDomain} onChange={handleDomainChange}>
//               <option value="">Select Domain</option>
//               {domains.map((domain) => (
//                 <option key={domain._id} value={domain.domainName}>{domain.domainName}</option>
//               ))}
//             </select>
//             <button className="btn btn-primary" onClick={handleViewProjects} style={{backgroundColor: '#4caf50', border: 'none'}}>
//               {loading ? 'Loading...' : 'View Projects'}
//             </button>
//           </div>
//         </div>
//         {projects.length > 0 && (
//           <div className="row mt-4">
//             <div className="col-md-12">
//               <h3>Projects under {selectedDomain}</h3>
//               <ul className="list-group">
//                 {projects.map((project) => (
//                   <li key={project._id} className="list-group-item">
//                     <FaFolder style={{ marginRight: '0.5rem', cursor: 'pointer' }} onClick={() => handleProjectClick(project)} />
//                     {project.projectName}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//         )}
//       </div>
//       {selectedProject && (
//         <div className="modal" tabIndex="-1" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)', position: 'fixed', top: 0, bottom: 0, left: 0, right: 0 }}>
//           <div className="modal-dialog modal-dialog-centered">
//             <div className="modal-content">
//               <div className="modal-header">
//                 <h5 className="modal-title">{selectedProject.projectName}</h5>
//                 <button type="button" className="btn-close" aria-label="Close" onClick={handleCloseModal}></button>
//               </div>
//               <div className="modal-body">
//                 <p><strong>Domain:</strong> {selectedProject.domain}</p>
//                 <p><strong>Description:</strong> {selectedProject.description}</p>
//                 <div className="mb-3">
//                   <button type="button" className="btn btn-outline-primary me-2" onClick={handleLike}><FaThumbsUp /> Like ({likes[selectedProject._id] || 0})</button>
//                   <button type="button" className="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#commentModal"><FaComment /> Comment</button>
//                 </div>
//                 <ul className="list-group">
//                   {comments[selectedProject._id] && comments[selectedProject._id].map((comment, index) => (
//                     <li key={index} className="list-group-item">{comment}</li>
//                   ))}
//                 </ul>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//       {/* Comment Modal */}
//       <div className="modal" id="commentModal" tabIndex="-1">
//         <div className="modal-dialog">
//           <div className="modal-content">
//             <div className="modal-header">
//               <h5 className="modal-title">Add Comment</h5>
//               <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
//             </div>
//             <div className="modal-body">
//               <div className="mb-3">
//                 <label htmlFor="nameInput" className="form-label">Your Name:</label>
//                 <input type="text" className="form-control" id="nameInput" value={nameInput} onChange={handleNameInput} />
//               </div>
//               <div className="mb-3">
//                 <label htmlFor="commentInput" className="form-label">Your Comment:</label>
//                 <textarea className="form-control" id="commentInput" rows="3" value={commentInput} onChange={handleCommentInput}></textarea>
//               </div>
//             </div>
//             <div className="modal-footer">
//               <button type="button" className="btn btn-primary" onClick={handleAddComment}>Add Comment</button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default User;


import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import axios from 'axios';
import { FaFolder, FaThumbsUp, FaComment } from 'react-icons/fa'; // Import icons from Font Awesome

const User = () => {
  const [selectedDomain, setSelectedDomain] = useState('');
  const [domains, setDomains] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [likes, setLikes] = useState({});
  const [comments, setComments] = useState({});
  const [commentInput, setCommentInput] = useState('');
  const [nameInput, setNameInput] = useState('');

  useEffect(() => {
    const fetchDomains = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/domains');
        setDomains(response.data.domains);
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
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/projects?domain=${selectedDomain}`);
      setProjects(response.data.projects);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setLoading(false);
    }
  };

  const fetchProjectDetails = async (project) => {
    try {
      setLoading(true);
      // Fetch old likes only when the like button is clicked
      const likesResponse = await axios.post('http://localhost:5000/api/projects/like', { projectName: project.projectName });
      setLikes({ [project.projectName]: likesResponse.data.likes });

      // Fetch old comments
      const commentsResponse = await axios.post('http://localhost:5000/api/projects/comment', { projectName: project.projectName });
      setComments({ [project.projectName]: commentsResponse.data.comments });

      setLoading(false);
    } catch (error) {
      console.error('Error fetching old likes and comments:', error);
      setLoading(false);
    }
  };
  

  const handleProjectClick = async (project) => {
    setSelectedProject(project);
    // Increment like count when a project is clicked
    await handleLike();
    fetchProjectDetails(project);
  };

  const handleLike = async () => {
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/api/projects/like', { projectName: selectedProject.projectName });
      setLikes((prevLikes) => ({
        ...prevLikes,
        [selectedProject.projectName]: response.data.likes,
      }));
      setLoading(false);
    } catch (error) {
      console.error('Error liking project:', error);
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    const commentAuthor = nameInput ? nameInput : 'Guest';
    const newComment = `${commentAuthor}: ${commentInput}`;
    try {
      setLoading(true);
      await axios.post('http://localhost:5000/api/projects/comment', {
        projectName: selectedProject.projectName,
        comment: newComment,
      });
      setComments((prevComments) => ({
        ...prevComments,
        [selectedProject.projectName]: [...(prevComments[selectedProject.projectName] || []), newComment],
      }));
      setCommentInput('');
      setNameInput('');
      setLoading(false);
    } catch (error) {
      console.error('Error adding comment:', error);
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedProject(null);
  };

  const handleCommentInput = (e) => {
    setCommentInput(e.target.value);
  };

  const handleNameInput = (e) => {
    setNameInput(e.target.value);
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
            <button className="btn btn-primary" onClick={handleViewProjects} style={{backgroundColor: '#4caf50', border: 'none'}}>
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
                <button type="button" className="btn-close" aria-label="Close" onClick={handleCloseModal}></button>
              </div>
              <div className="modal-body">
                <p><strong>Domain:</strong> {selectedProject.domain}</p>
                <p><strong>Description:</strong> {selectedProject.description}</p>
                <div className="mb-3">
                  <button type="button" className="btn btn-outline-primary me-2" onClick={handleLike}><FaThumbsUp /> Like ({likes[selectedProject.projectName] || 0})</button>
                  <button type="button" className="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#commentModal"><FaComment /> Comment</button>
                </div>
                <ul className="list-group">
                  {comments[selectedProject.projectName] && comments[selectedProject.projectName].map((comment, index) => (
                    <li key={index} className="list-group-item">{comment}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Comment Modal */}
      <div className="modal" id="commentModal" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Comment</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="nameInput" className="form-label">Your Name:</label>
                <input type="text" className="form-control" id="nameInput" value={nameInput} onChange={handleNameInput} />
              </div>
              <div className="mb-3">
                <label htmlFor="commentInput" className="form-label">Your Comment:</label>
                <textarea className="form-control" id="commentInput" rows="3" value={commentInput} onChange={handleCommentInput}></textarea>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" onClick={handleAddComment}>Add Comment</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default User;
