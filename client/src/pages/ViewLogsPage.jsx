import { useEffect, useState } from "react";
import LoadingIndicator from "../components/LoadingIndicator";
import { getAllLogs } from "../services/droneService";

export default function ViewLogsPage() {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const abortController = new AbortController();
    const droneId = import.meta.env.VITE_DRONE_ID;

    if(!droneId) return setIsLoading(false);

    getAllLogs(droneId, abortController.signal).then((result) => {
      setLogs(result);
    }).catch((err) => {
      console.error("Fetch error:", err);
    }).finally(() => {
      if(!abortController.signal.aborted) setIsLoading(false);
    });

    return () => abortController.abort("ViewLogsPage unmounted")
  }, []);

  return (
    <>
      {isLoading ? (
        <LoadingIndicator message="Loading logs..." />
      ) : logs.length ? (
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Drone ID</th>
                <th>Drone Name</th>
                <th>Country</th>
                <th>Celsius</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={`${log.drone_id}:${log.celsius}:${log.created}`}>
                  <td>{log.drone_id}</td>
                  <td>{log.drone_name}</td>
                  <td>{log.country}</td>
                  <td>{log.celsius}°</td>
                  <td style={{ fontVariantNumeric: "tabular-nums" }}>
                    {log.created}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : "No logs found"}
    </>
  );
}
