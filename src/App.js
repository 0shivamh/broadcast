import MeetComponent from "./Components/meet.component";

import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import BroadcastComponent from "./Components/broadcast.component";
import JoinComponent from "./Components/join.component";

function App() {
  return (
    <div className="App">

        <Router>
            <Routes>
                <Route path="/" element={<MeetComponent/>} />
                <Route path="/join" element={<JoinComponent/>} />
            </Routes>
        </Router>

        {/*<BroadcastComponent/>*/}
        {/*<JoinComponent/>*/}

      {/*<MeetComponent/>*/}

    </div>
  );
}

export default App;
