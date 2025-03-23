import { useEffect, useState } from "react";

import ViewConfigPage from "./pages/ViewConfigPage";
import TemperatureLogFormPage from "./pages/TemperatureLogFormPage";
import ViewLogsPage from "./pages/ViewLogsPage";
import Navigation from "./components/Navigation";
import { getDroneById } from "./services/droneService";

export default function App() {
  const [currentPage, setCurrentPage] = useState("viewConfig");
  const [drone, setDrone] = useState(null);
  const [isDroneLoading, setIsDroneLoading] = useState(true);

  const pages = {
    viewConfig: {
      name: "View Config",
      component: (
        <ViewConfigPage drone={drone} isDroneLoading={isDroneLoading} />
      ),
    },
    temperatureLogForm: {
      name: "Temperature Log Form",
      component: (
        <TemperatureLogFormPage drone={drone} isDroneLoading={isDroneLoading} />
      ),
    },
    viewLogs: {
      name: "View Logs",
      component: <ViewLogsPage />,
    },
  };

  useEffect(() => {
    const abortController = new AbortController();
    const droneId = import.meta.env.VITE_DRONE_ID;

    if(!droneId) return setIsDroneLoading(false);
    
    setIsDroneLoading(true);
    getDroneById(droneId, abortController.signal).then((result) => {
      setDrone(result);
    }).catch((err) => {
      console.error("Fetch error:", err);
    }).finally(() => {
      if(!abortController.signal.aborted) setIsDroneLoading(false);
    });
    
    return () => abortController.abort("App unmounted")
  }, []);

  return (
    <>
      <h1>Drone Details</h1>
      <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} pages={pages} />
      <main>{pages[currentPage].component}</main>
    </>
  );
}
