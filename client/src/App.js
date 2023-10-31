import { Route, Routes } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Aboutus from "./pages/Aboutus";
import Pagenotfound from "./pages/Pagenotfound";
import Spam from "./pages/Spam";
import Find from "./pages/Find";
import Login from "./pages/Login";


function App() {
  return (
    <>
      <Routes>
        <Route path = "/" element= {<Homepage />}/>
        <Route path = "/aboutus" element= {<Aboutus />}/>
        <Route path = "/spam" element= {<Spam />}/>
        <Route path = "/find" element= {<Find />}/>
        <Route path = "/login" element= {<Login />}/>
        <Route path = "*" element= {<Pagenotfound />}/>
      </Routes>
    </>
  );
}

export default App;
