import { useRef, useState } from "react";

import LoadingIndicator from "../components/LoadingIndicator";
import { createDroneLog } from "../services/droneService";

export default function TemperatureLogFormPage(props) {
  const dialogRef = useRef(null);
  const temperatureRef = useRef(null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setIsSubmitting(true)
      const result = await createDroneLog({
        drone_id: props.drone.drone_id,
        drone_name: "Napat Yimyuean",
        country: "Thailand",
        celsius: parseInt(temperatureRef.current.value),
        // drone_name: props.drone.drone_name,
        // country: props.drone.country,
      })
      console.log(result);
      setError(null)
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
    } finally {
      setIsSubmitting(false)
      dialogRef.current.showModal()
    }
  };

  return (
    <>
      {props.isDroneLoading ? (
        <LoadingIndicator message="Loading config..." />
      ) : props.drone ? (
        <>
          <dialog ref={dialogRef} data-status={error ? "error" : "success"}>
            <div>
            <button className="btn-x" onClick={() => {
                dialogRef.current.close()
                if(error) return
                temperatureRef.current.value = ""
              }}>
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
              <h2>
                {error ? "Error" : "Success"}
              </h2>
              <p>{error ? error : "Temperature log created successfully"}</p>
              <button className="btn" onClick={() => {
                dialogRef.current.close()
                if(error) return
                temperatureRef.current.value = ""
              }}>
                OK
              </button>
            </div>
          </dialog>
          <form onSubmit={handleSubmit}>
            <fieldset>
              <label htmlFor="temperature">Temperature in celsius</label>
              <input
                autoFocus
                ref={temperatureRef}
                id="temperature"
                type="number"
                placeholder="Enter temperature"
                required
                disabled={isSubmitting}
              />
            </fieldset>
            <button disabled={isSubmitting} className="btn">
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </form>
        </>
      ) : "Drone ID not found, please check the .env file"}
    </>
  );
}
