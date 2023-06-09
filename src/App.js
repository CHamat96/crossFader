import { Authentication } from "./features/authorization/Authorization";
import { loggedIn, revertAuth } from "./features/authorization/authorizationSlice";
import { useDispatch, useSelector } from "react-redux";
import { UserInput } from "./features/search/UserInput";
function App() {
  const dispatch = useDispatch()
  const isLoggedIn = useSelector(loggedIn)
  return (
    <div className="w-[1450px] max-w-[90%] my-0 mx-auto">
      <div className="bg-white w-lg min-w-3/5 max-w-lg border-solid border-4 border-black rounded-md p-4 m-10">
        <h1 className="text-4xl leading-tight font-extrabold font-accent md:text-6xl leading-snug">CrossFader</h1>
        <p className="text-sm md:text-base leading-tight">Seamlessly blend your favourite artists into a single playlist</p>
        {isLoggedIn && 
        <button
        className="button ml-0 mr-auto my-1 bg-green hover:bg-[#1FC7AB] "
        onClick={() => dispatch(revertAuth())}>
        Log Out
        </button>
        }
      </div>
      <Authentication />
      {isLoggedIn &&
       <UserInput />
      }
    </div>
  );
}

export default App;
