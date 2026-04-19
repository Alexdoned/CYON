import React, { useState, useEffect } from "react";
import { Camera, Video, Upload, Calendar, MapPin, Users } from "lucide-react";
import { initScrollAnimations, AnimatedSection } from "../utils/animations.jsx";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    deanery: '',
    parish: '',
    eventDate: '',
    mediaType: 'image',
    mediaFiles: []
  });

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  // Sample events data - in production this would come from API
  const sampleEvents = [
    {
      id: 1,
      title: "Bali Denary Convention 2024",
      description: "Annual convention bringing together youth from all Bali parishes",
      deanery: "Bali",
      parish: "All Parishes",
      eventDate: "2024-03-15",
      media: [
        { type: 'image', url: '/api/placeholder/400/300', caption: 'Opening ceremony' },
        { type: 'video', url: '/api/placeholder/video', caption: 'Worship session' }
      ],
      uploadedBy: "John Doe",
      uploadDate: "2024-03-16"
    },
    {
      id: 2,
      title: "St. Paul Bali Parish Youth Meeting",
      description: "Monthly youth fellowship and prayer meeting",
      deanery: "Bali",
      parish: "St. Paul Bali",
      eventDate: "2024-03-10",
      media: [
        { type: 'image', url: '/api/placeholder/400/300', caption: 'Group discussion' }
      ],
      uploadedBy: "Mary Johnson",
      uploadDate: "2024-03-11"
    }
  ];

  useEffect(() => {
    initScrollAnimations();
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch(`${API_URL}/events`);
      if (response.ok) {
        const data = await response.json();
        setEvents(data.data || []);
      } else {
        // Fallback to sample data if API fails
        setEvents(sampleEvents);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      // Fallback to sample data
      setEvents(sampleEvents);
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
    const files = Array.from(e.target.files);
    setUploadForm(prev => ({
      ...prev,
      mediaFiles: files
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (uploadForm.mediaFiles.length === 0) {
      alert('Please select at least one media file');
      return;
    }

    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append('title', uploadForm.title);
      formData.append('description', uploadForm.description);
      formData.append('deanery', uploadForm.deanery);
      formData.append('parish', uploadForm.parish);
      formData.append('eventDate', uploadForm.eventDate);
      // In production, you might want to get user ID from authentication
      // formData.append('uploadedBy', '1'); // Placeholder user ID - commented out for now

      // Add media files
      uploadForm.mediaFiles.forEach((file, index) => {
        formData.append('media', file);
      });

      const response = await fetch(`${API_URL}/events`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        alert('Event uploaded successfully!');

        // Reset form
        setUploadForm({
          title: '',
          description: '',
          deanery: '',
          parish: '',
          eventDate: '',
          mediaType: 'image',
          mediaFiles: []
        });
        setShowUploadForm(false);

        // Refresh events list
        fetchEvents();
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

  const parishes = {
    bali: ["St. Oliver Maihula", "St. Paul Bali", "St. Mary Jatau"],
    kofai: ["St. Peter Nukkai", "Holy Family Kofai", "St Athanesius Iware"],
    jalingo: ["St. Joseph Mayo-gwoi", "Holy Trinity Nyabunkaka", "St. Paul Sabongari"],
    zing: ["St. Thomas", "St. Patrick Tudun wada", "St. Stephen Bitako Yali"],
    kpantisawa: ["St. John Parish Kpantisawa", "St. Peter Pupule", "St. Theresa Mika"],
    yakoko: ["St. Monica's yakoko", "All Saints Lamma", "St. Peter Monkin"],
    olqp: ["St Patrick kpanti Napoo", "Our lady queen of peace ", "St Ann negatavah"],
    karimlamido: [ "St Joseph Lau", "Holy Family Karim Lamido", "St Patrick Jen Pastoral area", "St Theresa Kunini", "St John Bosko Chaplaincy Jimlari",],
    mutumbiyu: ["All Parishes"]
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <AnimatedSection animation="animate-on-scroll">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-green-800 mb-4">
              Event Gallery
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Share and view memories from denary and parish conventions, meetings, and special events
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
            Share Event Photos/Videos
          </button>
        </div>

        {/* Upload Form */}
        {showUploadForm && (
          <AnimatedSection animation="animate-on-scroll-scale">
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-green-800 mb-6">Upload Event Media</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Event Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={uploadForm.title}
                      onChange={handleInputChange}
                      placeholder="e.g., Bali Deanery Convention 2024"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Event Date *
                    </label>
                    <input
                      type="date"
                      name="eventDate"
                      value={uploadForm.eventDate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={uploadForm.description}
                    onChange={handleInputChange}
                    placeholder="Describe the event..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Deanery *
                    </label>
                    <select
                      name="denary"
                      value={uploadForm.denary}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    >
                      <option value="">Choose Deanery</option>
                      <option value="bali">Bali</option>
                      <option value="kofai">Kofai</option>
                      <option value="jalingo">Jalingo</option>
                      <option value="zing">Zing</option>
                      <option value="kpantisawa">Kpantisawa</option>
                      <option value="yakoko">Yakoko</option>
                      <option value="olqp">Our Lady Queen of Peace</option>
                      <option value="mutumbiyu">Mutum-Biyu</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Parish
                    </label>
                    <select
                      name="parish"
                      value={uploadForm.parish}
                      onChange={handleInputChange}
                      disabled={!uploadForm.deanery}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                    >
                      <option value="">Choose Parish</option>
                      {uploadForm.deanery && parishes[uploadForm.deanery]?.map((parish) => (
                        <option key={parish} value={parish}>{parish}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Media Type
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="mediaType"
                        value="image"
                        checked={uploadForm.mediaType === 'image'}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-green-600 focus:ring-green-500"
                      />
                      <span className="ml-2 flex items-center gap-1">
                        <Camera className="w-4 h-4" />
                        Photos
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="mediaType"
                        value="video"
                        checked={uploadForm.mediaType === 'video'}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-green-600 focus:ring-green-500"
                      />
                      <span className="ml-2 flex items-center gap-1">
                        <Video className="w-4 h-4" />
                        Videos
                      </span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload {uploadForm.mediaType === 'image' ? 'Photos' : 'Videos'} *
                  </label>
                  <input
                    type="file"
                    multiple
                    accept={uploadForm.mediaType === 'image' ? 'image/*' : 'video/*'}
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {uploadForm.mediaType === 'image'
                      ? 'Select multiple photos (JPG, PNG, etc.)'
                      : 'Select videos (MP4, MOV, etc.)'
                    }
                  </p>
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? 'Uploading...' : 'Upload Event'}
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

        {/* Events Gallery */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <AnimatedSection key={event.id} animation="animate-on-scroll-scale">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden hover-lift">
                {/* Event Header */}
                <div className="bg-green-600 text-white p-4">
                  <h3 className="text-lg font-bold">{event.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-green-100 mt-2">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(event.event_date || event.eventDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {event.deanery}
                    </div>
                  </div>
                </div>

                {/* Media Gallery */}
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {event.media.slice(0, 4).map((media, index) => (
                      <div key={index} className="relative">
                        {media.mime_type?.startsWith('image/') ? (
                          <img
                            src={`${API_URL}/events/media/${media.filename}`}
                            alt={media.original_name}
                            className="w-full h-24 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => setSelectedEvent({ ...event, selectedMedia: media })}
                          />
                        ) : (
                          <div
                            className="w-full h-24 bg-gray-200 rounded flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors"
                            onClick={() => setSelectedEvent({ ...event, selectedMedia: media })}
                          >
                            <Video className="w-8 h-8 text-gray-600" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <p className="text-gray-600 text-sm mb-3">{event.description}</p>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>By {event.uploader_name || event.uploadedBy || 'Community'}</span>
                    <span>{event.media?.length || 0} media files</span>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Modal for viewing media */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="p-4 border-b">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-green-800">{selectedEvent.title}</h3>
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <div className="p-4">
                {selectedEvent.selectedMedia?.mime_type?.startsWith('image/') ? (
                  <img
                    src={`${API_URL}/events/media/${selectedEvent.selectedMedia.filename}`}
                    alt={selectedEvent.selectedMedia.original_name}
                    className="w-full max-h-96 object-contain"
                  />
                ) : (
                  <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
                    <Video className="w-16 h-16 text-gray-600" />
                    <p className="mt-4 text-gray-600">Video: {selectedEvent.selectedMedia?.original_name}</p>
                    <p className="text-sm text-gray-500 mt-2">Video playback not implemented in demo</p>
                  </div>
                )}
                <p className="mt-4 text-center text-gray-600">{selectedEvent.selectedMedia?.original_name}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;