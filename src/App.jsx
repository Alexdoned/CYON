import React, { useState, useEffect } from "react";
import { User } from "lucide-react";
import logo from "/cyonlogo.png";

const App = () => {
  const data = {
    bali: ["St. Oliver Maihula", "St. Paul Bali", "St. Mary Jatau"],
    kofai: [
      "St. Peter Nukkai",
      "Holy Family Kofai",
      "St Athanesius Iware",
      "St. John Jebanbu",
      "St. Thomas Aquinas Chaplaincy",
      "St. Stephen Sunkani",
      "St.Peter Jauroyino",
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
       " St. Andrew Gampubong Pastoral",
    ],
    kpantisawa: [
        "St. John Parish Kpantisawa",
        "St. Peter Pupule",
        "St. Theresa Mika pastoral",

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
      "Pastoral Area",
      "St Peter Abuja phase 1",
      "St Justina mayo Dassa",
      "St John Paul de second gulom",
      "Church of Assumption Kona",
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

  const handleDenaryChange = (e) => setSelectedDenary(e.target.value);
  const handleParishChange = (e) => setSelectedParish(e.target.value);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
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

  const handleSubmit = () => {
    if (validateForm()) {
      const result = {
        denary: selectedDenary,
        parish: selectedParish,
        ...formData,
      };
      setSubmittedData(result);
      setErrors({});
    }
  };

  return (
    <div className="flex min-h-screen justify-center items-center flex-col bg-gray-100">

      <header className="flex flex-col items-center mb-6">
        <img src={logo} alt="CYON Logo" className="w-32 h-32 mb-4" />
        <h1 className="text-4xl text-center text-green-600 font-bold underline">
          Catholic Youth Organization of Nigeria <br /> Jalingo Diocese
        </h1>
      </header>

      
      <div className="flex justify-center items-center flex-col gap-4 shadow-2xl rounded-4xl p-6 bg-white/90 w-full max-w-2xl">
        <h3 className="text-3xl font-extrabold mt-2">Diocesan Registration Form</h3>

      
        <div className="flex flex-col w-full">
          <select
            id="denary"
            value={selectedDenary}
            onChange={handleDenaryChange}
            className="p-2 m-2 rounded-2xl border-2 border-green-800"
          >
            <option value="">Choose Denary</option>
            <option value="bali">Bali</option>
            <option value="kofai">Kofai</option>
            <option value="jalingo">Jalingo</option>
            <option value="zing">Zing</option>
            <option value="kpantisawa">Kpantisawa</option>
            <option value="yakoko">Yakoko</option>
            <option value="olqp">Olqp</option>
          </select>
          {errors.denary && <p className="text-red-600">{errors.denary}</p>}

          <select
            id="parish"
            value={selectedParish}
            onChange={handleParishChange}
            disabled={parishes.length === 0}
            className="p-2 m-2 rounded-2xl border-2 border-green-800"
          >
            <option value="">Choose Parish</option>
            {parishes.map((parish) => (
              <option key={parish.value} value={parish.value}>
                {parish.label}
              </option>
            ))}
          </select>
          {errors.parish && <p className="text-red-600">{errors.parish}</p>}
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
                className="w-full m-2 px-4 py-2 border-b-2 outline-0 border-green-800"
              />
              {errors[field] && <p className="text-red-600">{errors[field]}</p>}
            </div>
          ))}

          <button
            id="submit-btn"
            type="button"
            onClick={handleSubmit}
            className="mt-4 px-4 py-2 bg-green-800 text-white rounded-2xl w-full hover:bg-green-600"
          >
            Submit
          </button>
        </div>

        
        {submittedData && (
          <div className="mt-6 p-4 bg-green-100 border border-green-600 rounded-xl w-full">
            <h3 className="text-xl font-bold text-green-800">Form Submitted Successfully!</h3>
            <ul className="mt-2 text-gray-800 text-lg">
              <li><strong>Denary:</strong> {submittedData.denary}</li>
              <li><strong>Parish:</strong> {submittedData.parish}</li>
              <li><strong>Name:</strong> {submittedData.name}</li>
              <li><strong>Phone:</strong> {submittedData.phone}</li>
              <li><strong>Email:</strong> {submittedData.email}</li>
              <li><strong>Address:</strong> {submittedData.address}</li>
              <li><strong>Occupation:</strong> {submittedData.occupation}</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;