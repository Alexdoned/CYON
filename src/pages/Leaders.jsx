import React, { useState, useEffect } from "react";
import { Upload, Star, Trash2 } from "lucide-react";
import { initScrollAnimations, AnimatedSection } from "../utils/animations.jsx";

const Leaders = () => {
  const [leaders, setLeaders] = useState([]);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    name: '',
    year: new Date().getFullYear().toString(),
    achievement: '',
    photoFile: null
  });

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  // Sample leaders data
  const sampleLeaders = [
    {
      id: 1,
      name: "John Aminu",
      year: "2023",
      achievement: "Outstanding Youth Leader - Bali Denary",
      photo: '/api/placeholder/300/300'
    },
    {
      id: 2,
      name: "Mary Okonkwo",
      year: "2024",
      achievement: "Community Service Excellence - Jalingo Diocese",
      photo: '/api/placeholder/300/300'
    }
  ];

  useEffect(() => {
    initScrollAnimations();
    fetchLeaders();
  }, []);

  const fetchLeaders = async () => {
    try {
      const response = await fetch(`${API_URL}/leaders`);
      if (response.ok) {
        const data = await response.json();
        setLeaders(data.data || []);
      } else {
        setLeaders(sampleLeaders);
      }
    } catch (error) {
      console.error('Error fetching leaders:', error);
      setLeaders(sampleLeaders);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUploadForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setUploadForm(prev => ({
      ...prev,
      photoFile: file
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!uploadForm.name || !uploadForm.year || !uploadForm.achievement || !uploadForm.photoFile) {
      alert('Please fill in all fields and select a photo');
      return;
    }

    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append('name', uploadForm.name);
      formData.append('year', uploadForm.year);
      formData.append('achievement', uploadForm.achievement);
      formData.append('photo', uploadForm.photoFile);

      const response = await fetch(`${API_URL}/leaders`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        alert('Leader profile added successfully!');

        // Reset form
        setUploadForm({
          name: '',
          year: new Date().getFullYear().toString(),
          achievement: '',
          photoFile: null
        });
        setShowUploadForm(false);

        // Refresh leaders list
        fetchLeaders();
      } else {
        const error = await response.json();
        alert(`Upload failed: ${error.message}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (leaderId) => {
    if (!window.confirm('Are you sure you want to delete this leader profile?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/leaders/${leaderId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        alert('Leader profile deleted successfully');
        fetchLeaders();
      } else {
        alert('Failed to delete leader profile');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Delete failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <AnimatedSection animation="animate-on-scroll">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-green-800 mb-4">
              Leaders Recognition
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Celebrate and recognize outstanding leaders in our CYON community who have made a difference
            </p>
          </div>
        </AnimatedSection>

        {/* Upload Button */}
        <div className="mb-8 text-center">
          <button
            onClick={() => setShowUploadForm(!showUploadForm)}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center gap-2 mx-auto"
          >
            <Upload className="w-5 h-5" />
            Honor a Leader
          </button>
        </div>

        {/* Upload Form */}
        {showUploadForm && (
          <AnimatedSection animation="animate-on-scroll-scale">
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-green-800 mb-6">Add Leader Profile</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Leader Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={uploadForm.name}
                      onChange={handleInputChange}
                      placeholder="e.g., John Aminu"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Year of Achievement *
                    </label>
                    <input
                      type="number"
                      name="year"
                      value={uploadForm.year}
                      onChange={handleInputChange}
                      min="2000"
                      max={new Date().getFullYear()}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Achievement/Contribution *
                  </label>
                  <textarea
                    name="achievement"
                    value={uploadForm.achievement}
                    onChange={handleInputChange}
                    placeholder="Describe the leader's achievement or contribution..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Leader Photo *
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Select a photo (JPG, PNG, etc.)
                  </p>
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? 'Adding...' : 'Add Leader'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowUploadForm(false)}
                    disabled={isProcessing}
                    className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </AnimatedSection>
        )}

        {/* Leaders Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {leaders.map((leader) => (
            <AnimatedSection key={leader.id} animation="animate-on-scroll-scale">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden hover-lift">
                {/* Photo */}
                <div className="relative h-64 bg-gray-200 overflow-hidden">
                  <img
                    src={leader.photo_url ? `${API_URL}/leaders/photo/${leader.photo_url}` : leader.photo}
                    alt={leader.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-yellow-400 text-white px-3 py-1 rounded-full flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    {leader.year}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-xl font-bold text-green-800 mb-2">{leader.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{leader.achievement}</p>

                  {/* Delete Button - Only show if user is admin */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDelete(leader.id)}
                      className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 px-3 py-2 rounded hover:bg-red-100 transition-colors text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Empty State */}
        {leaders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No leaders added yet. Be the first to honor a leader!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaders;
