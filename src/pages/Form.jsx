import React from 'react'




function Form() {
  return (
    <div className="flex items-center justify-center h-screen">
      <form className="bg-amber-50" onSubmit={handleSubmission}>
        <div className="flex items-center justify-center font-bold text-4xl">
          <FaUser />
        </div>

        <div className="mb-2">
          <label className="text-2xl text-blue-600">Full Name:</label>
          <input
            type="text"
            placeholder="Enter your name "
            className="w-full text-gray-400 px-4 py-2 outline-blue-600"
          ></input>
        </div>
        <div>
          <label className="text-2xl text-blue-600">Email:</label>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full  outline-blue-600  text-gray-400  px-3 py-2"
          ></input>
        </div>
        <div>
          <label className="text-2xl text-blue-600">Phone:</label>
          <input
            type="tel"
            placeholder="Enter your phone"
            className="w-full outline-blue-600  text-gray-400 px-3 py-2"
          ></input>
        </div>
        <div>
          <label className="text-2xl text-blue-600">Password:</label>
          <input
            type="password"
            placeholder="Enter your password"
            className="w-full outline-blue-600  text-gray-400 px-3 py-1"
          ></input>
        </div>

        <button className="w-full bg-blue-600 mt-2 rounded-md p-2  hover:bg-blue-400 pointer-cursor text-white">
          Register
        </button>
        <button className="w-full bg-sky-900 pointer hover:bg-sky-500 mt-2 rounded-md p-2 text-2xl text-white focus:outline-3 focus:outline-violet-500 focus:outline-offset-3 active:bg-amber-900">
          Login
        </button>
      </form>
    </div>
  );
}

export default Form
