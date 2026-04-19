import React, { useState, useEffect } from "react";
import { User, AlertCircle } from "lucide-react";
import { initScrollAnimations, AnimatedSection } from "../utils/animations.jsx";

const Form = () => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const data = {
    bali: [
      "St. Oliver Maihula", 
      "St. Paul Bali", 
      "St. Mary Jatau",
    ],
    kofai: [
      "St. Peter Nukkai",
      "Holy Family Kofai",
      "St Athanasius Iware",
      "St. John the Baptist Janebanbu",
      "St. Thomas Aquinas Chaplaincy",
      "St. Gabriel Sunkani",
      "St.Peter chaplaincy Jauro Yino",
    ],
    jalingo: [
      "St. Joseph Mayo-gwoi",
      "Holy Trinity Nyabunkaka",
      "St. Paul Sabongari ",
      "St. Paul Tutunwada",
      "St. Augustine Jalingo",
      "St. Theresa NTA",
    ],
    zing: [
      "St. Thomas",
      "St. Patrick Tudun wada",
      "St. Stephen Bitako Yali Pastoral",
      "St. Mary Bitako Mazara pastoral",
      "St. Andrew Gampubong Pastoral",
    ],
    kpantisawa: [
      "St. John Parish Kpantisawa",
      "St. Peter Pupule",
      "St. Theresa Mika pastoral",
      "St. Thesesa of the child Jesus",
    ],
    yakoko: [
      "St. Monica's yakoko",
      "All Saints Lamma",
      "St. Peter Monkin",
    ],
    olqp: [
      "St Patrick kpanti Napoo",
      "Our lady queen of peace cathedral",
      "St Ann negatavah",
      "Pastoral Area Dinya",
      "Patoral area Orga",
      "St Peter Abuja phase 1",
      "St Justina mayo Dassa",
      "St John Paul de second gulom",
      "Church of Assumption Kona",
      ""
    ],
    
    mutumbiyu: [
      "St John Mutum-biyu",
      "St Paul Tella",
      "St Parick Sabongida",
      "St Monica Nam-nail",
      "St Denis Pena",
      "St Mathew Dan Anacha"

    ],
   karim: [
      "St Joseph Lau",
      "Holy Family Karim Lamido",
      "St Patrick Jen Pastoral area",
      "St Theresa Kunini",
      "St John Bosko Chaplaincy Jimlari"
    ],
  };

  const [selectedDenary, setSelectedDenary] = useState("");
  const [selectedParish, setSelectedParish] = useState("");
  const [parishes, setParishes] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    occupation: "",
  });
  const [errors, setErrors] = useState({});
  const [submittedData, setSubmittedData] = useState(null);
  const [redirectTimeoutId, setRedirectTimeoutId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isReviewMode, setIsReviewMode] = useState(false);

  useEffect(() => {
    if (selectedDenary && data[selectedDenary]) {
      const parishList = data[selectedDenary];
      setParishes(parishList.map((p) => ({ value: p, label: p })));
      setSelectedParish("");
    } else {
      setParishes([]);
      setSelectedParish("");
    }
  }, [selectedDenary]);

  useEffect(() => {
    initScrollAnimations();
  }, []);

  const handleDenaryChange = (e) => setSelectedDenary(e.target.value);
  const handleParishChange = (e) => setSelectedParish(e.target.value);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleEdit = () => {
    if (!submittedData) return;
    if (redirectTimeoutId) {
      clearTimeout(redirectTimeoutId);
      setRedirectTimeoutId(null);
    }

    setSelectedDenary(submittedData.denary);
    setSelectedParish(submittedData.parish);
    setFormData({
      name: submittedData.name,
      phone: submittedData.phone,
      email: submittedData.email,
      address: submittedData.address,
      occupation: submittedData.occupation,
    });
    setSubmittedData(null);
    setSuccessMessage("");
    setServerError("");
    setErrors({});
  };

  const handleEditReview = () => {
    setIsReviewMode(false);
    setServerError("");
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    setServerError("");
    setSuccessMessage("");

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          denary: selectedDenary,
          parish: selectedParish,
          ...formData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setServerError(data.message || "Failed to submit form");
        return;
      }

      // Store registration ID for payment
      const registrationId = data.id;
      localStorage.setItem('pendingRegistrationId', registrationId);

      const result = {
        id: registrationId,
        denary: selectedDenary,
        parish: selectedParish,
        ...formData,
      };
      setSubmittedData(result);
      setSuccessMessage("Registration submitted successfully! Please proceed to payment.");
      setIsReviewMode(false);

      // Redirect to payment after a short delay
      const timerId = setTimeout(() => {
        window.location.href = `/payment?registrationId=${registrationId}`;
      }, 2000);
      setRedirectTimeoutId(timerId);

      setFormData({
        name: "",
        phone: "",
        email: "",
        address: "",
        occupation: "",
      });
      setSelectedDenary("");
      setSelectedParish("");
      setParishes([]);
    } catch (error) {
      setServerError("Network error. Please try again.");
      console.error("Submission error:", error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.phone.match(/^\+?\d{10,}$/))
      newErrors.phone = "Enter a valid phone number";
    if (!formData.email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/))
      newErrors.email = "Enter a valid email";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.occupation.trim())
      newErrors.occupation = "Occupation is required";
    if (!selectedDenary) newErrors.denary = "Choose a denary";
    if (!selectedParish) newErrors.parish = "Choose a parish";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      setIsReviewMode(true);
      setServerError("");
    }
  };

  return (
    <div className="min-h-screen py-12 bg-gray-100">
      <AnimatedSection animation="animate-on-scroll-scale">
        <div className="flex justify-center items-center flex-col gap-4 shadow-2xl rounded-4xl p-6 bg-white/90 w-full max-w-2xl mx-auto">
          <h3 className="text-3xl font-extrabold mt-2">Diocesan Registration Form</h3>

          {serverError && (
            <div className="w-full p-4 bg-red-50 border border-red-200 rounded-lg flex gap-2 text-red-600 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p>{serverError}</p>
            </div>
          )}

          <div className="flex flex-col w-full">
            <select
              id="denary"
              value={selectedDenary}
              onChange={handleDenaryChange}
              className="p-2 m-2 rounded-2xl border-2 border-green-800 focus:outline-none focus:ring-2 focus:ring-green-600"
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
              <option value="karim">Karim-Lamido</option>
            </select>
            {errors.denary && <p className="text-red-600 text-sm ml-2">{errors.denary}</p>}

            <select
              id="parish"
              value={selectedParish}
              onChange={handleParishChange}
              disabled={parishes.length === 0}
              className="p-2 m-2 rounded-2xl border-2 border-green-800 focus:outline-none focus:ring-2 focus:ring-green-600 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">Choose Parish</option>
              {parishes.map((parish) => (
                <option key={parish.value} value={parish.value}>
                  {parish.label}
                </option>
              ))}
            </select>
            {errors.parish && <p className="text-red-600 text-sm ml-2">{errors.parish}</p>}
          </div>

          <div className={`${selectedDenary && selectedParish ? "block" : "hidden"} w-full`}>
            <div className="flex items-center justify-center">
              <User />
            </div>
            <h2 className="mb-4 text-2xl">Personal Information</h2>

            {["name", "phone", "email", "address", "occupation"].map((field) => (
              <div key={field} className="w-full">
                <input
                  id={field}
                  type={field === "email" ? "email" : field === "phone" ? "tel" : "text"}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={formData[field]}
                  onChange={handleInputChange}
                  className="w-full m-2 px-4 py-2 border-b-2 outline-0 border-green-800 focus:ring-2 focus:ring-green-600 focus:border-transparent"
                />
                {errors[field] && <p className="text-red-600 text-sm ml-2">{errors[field]}</p>}
              </div>
            ))}

            <button
              id="submit-btn"
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="mt-4 px-4 py-2 bg-green-800 text-white rounded-2xl w-full hover:bg-green-600 transition-colors duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>

          {isReviewMode && (
            <div className="mt-6 p-4 bg-blue-100 border border-blue-600 rounded-xl w-full animate-in">
              <h3 className="text-xl font-bold text-blue-800 mb-4">Review Your Information</h3>
              <ol className="mt-3 text-gray-800 text-lg space-y-2">
                <li><strong>Denary:</strong> {selectedDenary}</li>
                <li><strong>Parish:</strong> {selectedParish}</li>
                <li><strong>Name:</strong> {formData.name}</li>
                <li><strong>Phone:</strong> {formData.phone}</li>
                <li><strong>Email:</strong> {formData.email}</li>
                <li><strong>Address:</strong> {formData.address}</li>
                <li><strong>Occupation:</strong> {formData.occupation}</li>
              </ol>
              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={handleEditReview}
                  className="flex-1 px-4 py-2 bg-yellow-500 text-white rounded-2xl hover:bg-yellow-400 transition-colors duration-200 font-semibold"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-green-800 text-white rounded-2xl hover:bg-green-600 transition-colors duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>
              </div>
            </div>
          )}

          {submittedData && (
            <div className="mt-6 p-4 bg-green-100 border border-green-600 rounded-xl w-full animate-in">
              <h3 className="text-xl font-bold text-green-800">Form Submitted Successfully!</h3>
              <p className="text-green-700 text-sm mt-2">{successMessage}</p>
              <ol className="mt-3 text-gray-800 text-lg space-y-2">
                <li><strong>Denary:</strong> {submittedData.denary}</li>
                <li><strong>Parish:</strong> {submittedData.parish}</li>
                <li><strong>Name:</strong> {submittedData.name}</li>
                <li><strong>Phone:</strong> {submittedData.phone}</li>
                <li><strong>Email:</strong> {submittedData.email}</li>
                <li><strong>Address:</strong> {submittedData.address}</li>
                <li><strong>Occupation:</strong> {submittedData.occupation}</li>
              </ol>
              <button
                type="button"
                onClick={handleEdit}
                className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded-2xl hover:bg-yellow-400 transition-colors duration-200 font-semibold"
              >
                Edit Submission
              </button>
            </div>
          )}
        </div>
      </AnimatedSection>
    </div>
  );
};

export default Form;
