import { Link } from "react-router-dom";

import GIF from "../assets/images/random.gif";

const LandingPage = () => {
  return (
    <div className="p-4 px-16 flex justify-center items-center h-screen w-screen bg-black">
      <div className="m-10 space-y-12 flex flex-col justify-evenly w-3/5">
        <div>
          <h1 className="my-4 text-6xl font-extrabold text-white">
            Code Grader Feedback
          </h1>
        </div>
        <div className="text-gray-400 text-md">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolore,
          debitis et maiores cupiditate velit nihil dolorem earum libero tempore
          similique quam asperiores doloremque laudantium impedit architecto
          officiis blanditiis itaque iste maxime.
        </div>
        <div className="flex items-center mt-16">
          <Link to="/homepage">
            <button
              type="button"
              className="w-48 bg-white text-black border-2 border-black rounded-xl text-lg font-medium px-2 py-2 text-center hover:bg-black hover:text-white hover:shadow-md hover:border-white hover:border-2 "
            >
              Get Started
            </button>
          </Link>
        </div>
      </div>
      <div>
        <img className="object-cover h-96" src={GIF} alt="image description" />
      </div>
    </div>
  );
};

export default LandingPage;
