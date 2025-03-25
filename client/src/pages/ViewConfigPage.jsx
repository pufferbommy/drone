import LoadingIndicator from "../components/LoadingIndicator";

export default function ViewConfigPage(props) {
  return (
    <>
      {props.isDroneLoading ? (
        <LoadingIndicator message="Loading config..." />
      ) : props.drone ? (
        <>
          <fieldset>
            <label htmlFor="drone-id">Drone ID</label>
            <input id="drone-id" disabled value={props.drone.drone_id} autoComplete="off" />
          </fieldset>
          <fieldset>
            <label htmlFor="drone-name">Drone Name</label>
            {/* <input id="drone-name" disabled value={props.drone.drone_name} autoComplete="off" /> */}
            <input id="drone-name" disabled value="Napat Yimyuean" autoComplete="off" />
          </fieldset>
          <fieldset>
            <label htmlFor="light">Light</label>
            <input id="light" disabled value={props.drone.light} autoComplete="off" />
          </fieldset>
          <fieldset>
            <label htmlFor="country">Country</label>
            {/* <input id="country" disabled value={props.drone.country} autoComplete="off" /> */}
            <input id="country" disabled value="Thailand" autoComplete="off" />
          </fieldset>
        </>
      ) : "Drone ID not found, please check the .env file"}
    </>
  );
}
