import React from "react";
import Spinner from "./Spinner";

const LoadingOverlay = () => (
  <div className="loading-overlay" role="status">
    <Spinner />
  </div>
);

export default LoadingOverlay;
