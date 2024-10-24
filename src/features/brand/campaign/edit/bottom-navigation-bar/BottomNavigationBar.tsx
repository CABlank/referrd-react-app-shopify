import React, { useEffect, useState } from "react";

interface BottomNavigationBarProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  onClose: () => void;
  onSaveDraft: () => void; // Function to handle save draft
  onPublish: () => void; // Function to handle publishing
  isNextDisabled: boolean;
  isPreviousDisabled: boolean;
  isVerifying: boolean;
}

const BottomNavigationBar: React.FC<BottomNavigationBarProps> = ({
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  onClose,
  onSaveDraft,
  onPublish,
  isNextDisabled,
  isPreviousDisabled,
  isVerifying,
}) => {
  const [isVisible, setIsVisible] = useState(true); // Control visibility of the bottom bar
  const [currentSubStep, setCurrentSubStep] = useState(1);
  const [subStepMode, setSubStepMode] = useState<"basic" | "advanced">("basic");
  const [hasSidebar, setHasSidebar] = useState(false);

  useEffect(() => {
    // Check if the sidebar exists in the DOM
    const sidebarExists = document.getElementById("sidebar-desktop") !== null;
    setHasSidebar(sidebarExists);
  }, []);

  // Function to update the subStepMode based on the selected format
  const updateSubStepMode = () => {
    const format = document.body.getAttribute("data-selected-format");

    if (format === "Both") {
      setSubStepMode("advanced");
    } else if (format === "Popup") {
      setSubStepMode("basic");
    }
  };

  // Use MutationObserver to watch for changes in the data-selected-format attribute
  useEffect(() => {
    updateSubStepMode();

    const observer = new MutationObserver(() => {
      updateSubStepMode();
      setCurrentSubStep(1); // Reset substep to 4.1 when format changes
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["data-selected-format"],
    });

    return () => observer.disconnect();
  }, []);

  const totalSubSteps = subStepMode === "basic" ? 4 : 8;

  useEffect(() => {
    document.body.setAttribute("data-current-substep", currentSubStep.toString());
  }, [currentSubStep]);

  // Adjusted step-specific guidance messages
  const stepMessages: { [key: string]: string } = {
    "1": "Define the basic details of your campaign, including the name, start date, and close date.",
    "2": "Configure your referral settings, including commission structure and terms.",
    "3": "Configure your general settings for the campaign.",
    "4-0": "Please select the format: Popup or Popup + Top Bar.",
    "4-1": "Customize your Popup for Desktop - Step 1. Set up height, width, and design elements.",
    "4-2": "Customize your Popup for Desktop - Step 2. Finalize design for desktop.",
    "4-3": "Customize your Popup for Mobile - Step 1. Set up form fields and other elements.",
    "4-4": "Customize your Popup for Mobile - Step 2. Add final adjustments for mobile devices.",
    "4-5": "Customize your Top Bar for Desktop - Step 1. Configure the layout and call to action.",
    "4-6": "Customize your Top Bar for Desktop - Step 2. Add sharing icons and finalize content.",
    "4-7": "Customize your Top Bar for Mobile - Step 1. Configure the layout and call to action.",
    "4-8": "Customize your Top Bar for Mobile - Step 2. Finalize design for mobile.",
    "5": "Review your campaign details and publish it to make it live.",
  };

  const currentStepKey = currentStep === 4 ? `4-${currentSubStep}` : currentStep.toString();
  const currentStepMessage = stepMessages[currentStepKey] || "Complete this step to proceed.";

  const progressPercentage =
    currentStep === 4
      ? ((currentSubStep - 1) / totalSubSteps) * (100 / totalSteps) +
        ((currentStep - 1) / totalSteps) * 100
      : (currentStep / totalSteps) * 100;

  // Handle Next button click
  const handleNext = () => {
    if (currentStep === 4 && currentSubStep < totalSubSteps) {
      setCurrentSubStep(currentSubStep + 1);
    } else {
      onNext();
      setCurrentSubStep(1);
    }
  };

  // Handle Previous button click
  const handlePrevious = () => {
    if (currentStep === 4 && currentSubStep > 1) {
      setCurrentSubStep(currentSubStep - 1);
    } else {
      onPrevious();
    }
  };

  // Handle Close button click to hide the bottom bar
  const handleClose = () => {
    setIsVisible(false);
    onClose();
  };

  // If the bar is hidden, don't render it
  if (!isVisible) {
    return null;
  }

  return (
    <div
      style={{
        ...styles.fixedBar,
        left: hasSidebar ? "240px" : "0",
        width: hasSidebar ? "calc(100% - 240px)" : "100%",
      }}
    >
      <div style={styles.container}>
        {/* Left Side: Close Button */}
        <button onClick={handleClose} style={styles.closeButton}>
          Close
        </button>

        {/* Center: Step Message and Progress Bar */}
        <div style={styles.centerContent}>
          <div style={styles.stepMessage}>{currentStepMessage}</div>

          <div style={styles.stepText}>
            {currentStep === 4 && currentSubStep > 0
              ? `Step 4 - Substep ${currentSubStep} of ${totalSubSteps}`
              : `Step ${currentStep} of ${totalSteps}`}
          </div>
          <div style={styles.progressBar}>
            <div
              style={{
                ...styles.progressIndicator,
                width: `${progressPercentage.toFixed(2)}%`,
              }}
            ></div>
          </div>
        </div>

        {/* Right Side: Previous and Next/Publish/Save Draft Button */}
        <div style={styles.rightButtonGroup}>
          {/* Previous Button */}
          <button
            onClick={handlePrevious}
            style={
              isPreviousDisabled
                ? { ...styles.button, ...styles.disabledButton }
                : { ...styles.button, ...styles.activeButton }
            }
            disabled={isPreviousDisabled}
          >
            Previous
          </button>

          {/* If currentStep is the last step (6), show Publish and Save Draft buttons */}
          {currentStep === totalSteps ? (
            <>
              <button onClick={onSaveDraft} style={styles.saveDraftButton} disabled={isVerifying}>
                {isVerifying ? (
                  <div style={styles.loaderContainer}>
                    <span style={styles.spinner} /> Saving Draft...
                  </div>
                ) : (
                  "Save Draft"
                )}
              </button>
              <button onClick={onPublish} style={styles.publishButton} disabled={isVerifying}>
                {isVerifying ? (
                  <div style={styles.loaderContainer}>
                    <span style={styles.spinner} /> Publishing...
                  </div>
                ) : (
                  "Publish"
                )}
              </button>
            </>
          ) : (
            /* Otherwise, show the Next button */
            <button
              onClick={handleNext}
              style={
                isNextDisabled
                  ? { ...styles.button, ...styles.disabledButton }
                  : { ...styles.button, ...styles.nextButton }
              }
              disabled={isNextDisabled || isVerifying}
            >
              {isVerifying ? (
                <div style={styles.loaderContainer}>
                  <span style={styles.spinner} /> Verifying...
                </div>
              ) : (
                "Next"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Dynamically adjust styles based on the presence of the sidebar
const styles: { [key: string]: React.CSSProperties } = {
  fixedBar: {
    position: "fixed",
    bottom: 0,

    backgroundColor: "#1a1a1a", // Dark background
    borderTop: "1px solid #4a4a4a", // Border at the top
    boxShadow: "0 -4px 10px rgba(0, 0, 0, 0.1)", // Shadow to give elevation
    padding: "16px 32px",
    zIndex: 50,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    maxWidth: "1120px", // Max width for larger screens
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  closeButton: {
    backgroundColor: "#f8f9fa", // Light gray for Close button
    color: "#333", // Dark text
    padding: "12px 24px",
    borderRadius: "8px",
    border: "1px solid #ccc", // Border for Close button
    cursor: "pointer",
  },
  button: {
    padding: "12px 24px",
    borderRadius: "8px",
    fontWeight: 600,
    fontSize: "16px",
    transition: "background-color 0.2s ease",
    border: "none",
    cursor: "pointer",
  },
  activeButton: {
    backgroundColor: "#4a5568", // Active background for Previous
    color: "#fff", // White text for contrast
  },
  disabledButton: {
    backgroundColor: "#cbd5e0", // Disabled background
    color: "#718096", // Muted text
    cursor: "not-allowed",
  },
  nextButton: {
    backgroundColor: "#28a745", // Bright green for Next/Publish
    color: "#fff", // White text
  },
  rightButtonGroup: {
    display: "flex",
    gap: "12px", // Space between Previous and Next/Publish buttons
  },
  saveDraftButton: {
    backgroundColor: "#3B82F6", // Neutral gray for Save Draft
    color: "#fff", // White text for contrast
    borderRadius: "8px",
    fontWeight: 600,
    padding: "12px 24px",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
  },
  publishButton: {
    backgroundColor: "#28a745", // Bright green for Publish
    color: "#fff", // White text
    borderRadius: "8px",
    fontWeight: 600,
    padding: "12px 24px",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
  },
  saveDraftButtonHover: {
    backgroundColor: "#3B82F6", // Darker shade on hover
  },
  publishButtonHover: {
    backgroundColor: "#218838", // Darker green on hover
  },
  centerContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    flexGrow: 1,
    padding: "0 16px", // Center padding for breathing space
    textAlign: "center",
  },
  stepMessage: {
    fontSize: "14px",
    color: "#ffffff", // White text for step message
    marginBottom: "8px", // Space below the message
  },
  stepText: {
    fontWeight: 500,
    color: "#ffffff", // White text for Step X of Y
    marginBottom: "8px",
  },
  progressBar: {
    position: "relative",
    width: "224px", // Width of the progress bar
    height: "8px", // Height of the progress bar
    backgroundColor: "#cbd5e0", // Light gray background
    borderRadius: "9999px", // Fully rounded bar
    marginTop: "8px",
  },
  progressIndicator: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    backgroundColor: "#48bb78", // Green progress color
    borderRadius: "9999px", // Fully rounded indicator
    transition: "width 0.3s ease", // Smooth transition for width
  },
  loaderContainer: {
    display: "flex",
    alignItems: "center",
  },
  spinner: {
    width: "16px",
    height: "16px",
    border: "2px solid #ccc",
    borderTop: "2px solid #007bff", // Blue spinning part
    borderRadius: "50%",
    marginRight: "8px",
    animation: "spin 1s linear infinite",
  },
};

export default BottomNavigationBar;
