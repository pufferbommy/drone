export default function LoadingIndicator(props) {
  return (
    <div className="loading-indicator">
      <span className="loader" />
      {props.message || "Loading..."}
    </div>
  );
}
