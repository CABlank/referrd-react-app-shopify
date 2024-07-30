import React, {
  useEffect,
  useImperativeHandle,
  useState,
  forwardRef,
} from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ElementProps, PopupConfig } from "../../CommonComponents/Types";
import PopupPreview from "./PopupPreview";
import { compress, decompress } from "compress-json";

interface RealPopupProps {
  serializedState?: string;
  settingsState?: string;
  stepOneElements?: ElementProps[];
  stepTwoElements?: ElementProps[];
  setStepOneElements?: React.Dispatch<React.SetStateAction<ElementProps[]>>;
  setStepTwoElements?: React.Dispatch<React.SetStateAction<ElementProps[]>>;
  view: "desktop" | "mobile";
  step?: number;
  setStep?: React.Dispatch<React.SetStateAction<number>>;
  url?: string;
  setUrl?: React.Dispatch<React.SetStateAction<string>>;
  setIsStepTwoAvailable?: React.Dispatch<React.SetStateAction<boolean>>;
  enableDragAndDrop?: boolean;
  onLoad?: () => void; // Add the onLoad prop
}

const RealPopup = forwardRef<unknown, RealPopupProps>(
  (
    {
      serializedState,
      settingsState,
      stepOneElements: initialStepOneElements = [],
      stepTwoElements: initialStepTwoElements = [],
      setStepOneElements,
      setStepTwoElements,
      view: initialView = "desktop",
      step: initialStep = 1,
      setStep,
      url: initialUrl = "",
      setUrl,
      setIsStepTwoAvailable,
      enableDragAndDrop = false,
      onLoad, // Destructure the onLoad prop
    },
    ref
  ) => {
    const [desktopStepOneElements, setDesktopStepOneElementsState] = useState<
      ElementProps[]
    >(initialStepOneElements);
    const [desktopStepTwoElements, setDesktopStepTwoElementsState] = useState<
      ElementProps[]
    >(initialStepTwoElements);
    const [mobileStepOneElements, setMobileStepOneElementsState] = useState<
      ElementProps[]
    >(initialStepOneElements);
    const [mobileStepTwoElements, setMobileStepTwoElementsState] = useState<
      ElementProps[]
    >(initialStepTwoElements);
    const [config, setConfig] = useState<PopupConfig | null>(null);
    const [step, setStepState] = useState<number>(initialStep);
    const [url, setUrlState] = useState<string>(initialUrl);
    const [isStepTwoAvailable, setIsStepTwoAvailableState] =
      useState<boolean>(true);
    const [view, setView] = useState<"desktop" | "mobile">(initialView);
    const [manualViewChange, setManualViewChange] = useState(false);

    const getConfig = (
      settings: any,
      view: "desktop" | "mobile",
      step: number
    ) => {
      return settings[`${view}Step${step}`] || null;
    };

    // Function to deserialize state
    const deserializeState = (newSerializedState: string) => {
      if (!newSerializedState) return;
      try {
        const compressedState = JSON.parse(newSerializedState);
        const deserializedState = JSON.parse(
          JSON.stringify(decompress(compressedState))
        );
        console.log("Deserializing state:", deserializedState); // Added logging here

        setDesktopStepOneElementsState(
          deserializedState.desktopStepOneElements || []
        );
        setDesktopStepTwoElementsState(
          deserializedState.desktopStepTwoElements || []
        );
        setMobileStepOneElementsState(
          deserializedState.mobileStepOneElements || []
        );
        setMobileStepTwoElementsState(
          deserializedState.mobileStepTwoElements || []
        );
        setStepState(deserializedState.step || 1);
        setUrlState(deserializedState.url || "");
        setIsStepTwoAvailableState(deserializedState.isStepTwoAvailable);
        setConfig(deserializedState.config || null);
        setView(deserializedState.view || "desktop");

        if (onLoad) {
          onLoad(); // Call onLoad after deserializing the state
        }
      } catch (error) {
        console.error("Failed to deserialize state:", error);
      }
    };

    useImperativeHandle(ref, () => ({
      serializeState: () => {
        if (!config) return null;
        const state = {
          desktopStepOneElements,
          desktopStepTwoElements,
          mobileStepOneElements,
          mobileStepTwoElements,
          view,
          config,
          step,
          url,
          isStepTwoAvailable,
        };
        const serializedState = JSON.stringify(state);
        const compressedState = compress(JSON.parse(serializedState));
        return JSON.stringify(compressedState);
      },
      deserializeState,
    }));

    useEffect(() => {
      if (serializedState) {
        console.log("Serialized state provided:", serializedState);
        const deserializedState = JSON.parse(serializedState);
        console.log("Parsed serialized state:", deserializedState);
        if (deserializedState) {
          setDesktopStepOneElementsState(
            deserializedState.desktopStepOneElements || []
          );
          setDesktopStepTwoElementsState(
            deserializedState.desktopStepTwoElements || []
          );
          setMobileStepOneElementsState(
            deserializedState.mobileStepOneElements || []
          );
          setMobileStepTwoElementsState(
            deserializedState.mobileStepTwoElements || []
          );
          setUrlState(deserializedState.url || "");
          setStepState(deserializedState.step || 1);
          setIsStepTwoAvailableState(
            deserializedState.isStepTwoAvailable || false
          );
          setView(deserializedState.view || "desktop");

          if (onLoad) {
            onLoad(); // Call onLoad after setting the state
          }
        }
      }

      if (settingsState) {
        console.log("Settings state provided:", settingsState);
        try {
          const deserializedSettings = JSON.parse(settingsState);
          console.log("Deserialized settings:", deserializedSettings);
          const currentConfig = getConfig(
            deserializedSettings,
            initialView,
            initialStep
          );
          setConfig(currentConfig);
          console.log("Current config:", currentConfig);

          if (onLoad) {
            onLoad(); // Call onLoad after deserializing the settings
          }
        } catch (error) {
          console.error("Failed to initialize with settings state:", error);
        }
      }
    }, [serializedState, settingsState, initialView, initialStep]);

    useEffect(() => {
      const handleResize = () => {
        if (!manualViewChange) {
          const deserializedSettings = JSON.parse(settingsState ?? "");
          const desktopStep1 =
            parseInt(
              deserializedSettings.desktopStep2.width.replace("px", ""),
              10
            ) - 1;

          console.log("Mobile width:", desktopStep1);
          const newView =
            window.innerWidth <= desktopStep1 ? "mobile" : "desktop";
          setView(newView);
          if (settingsState) {
            const deserializedSettings = JSON.parse(settingsState);
            const newConfig = getConfig(deserializedSettings, newView, step);
            setConfig(newConfig);
            console.log("New config after resize:", newConfig);
          }
        }
      };

      window.addEventListener("resize", handleResize);

      handleResize();

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }, [manualViewChange, step, settingsState]);

    useEffect(() => {
      if (setStepOneElements) {
        setStepOneElements(
          view === "desktop" ? desktopStepOneElements : mobileStepOneElements
        );
      }
    }, [
      desktopStepOneElements,
      mobileStepOneElements,
      setStepOneElements,
      view,
    ]);

    useEffect(() => {
      if (setStepTwoElements) {
        setStepTwoElements(
          view === "desktop" ? desktopStepTwoElements : mobileStepTwoElements
        );
      }
    }, [
      desktopStepTwoElements,
      mobileStepTwoElements,
      setStepTwoElements,
      view,
    ]);

    useEffect(() => {
      if (settingsState) {
        const deserializedSettings = JSON.parse(settingsState);
        const newConfig = getConfig(deserializedSettings, view, step);
        setConfig(newConfig);
        console.log("New config after settings state change:", newConfig);
      }
    }, [view, step, settingsState]);

    return (
      <DndProvider backend={HTML5Backend}>
        <div
          className="real-popup-container"
          style={{
            width: config?.width || "100%",
            height: config?.height || "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {config && (
            <PopupPreview
              stepOneElements={
                view === "desktop"
                  ? desktopStepOneElements
                  : mobileStepOneElements
              }
              setStepOneElements={
                view === "desktop"
                  ? setDesktopStepOneElementsState
                  : setMobileStepOneElementsState
              }
              stepTwoElements={
                view === "desktop"
                  ? desktopStepTwoElements
                  : mobileStepTwoElements
              }
              setStepTwoElements={
                view === "desktop"
                  ? setDesktopStepTwoElementsState
                  : setMobileStepTwoElementsState
              }
              view={view}
              config={config}
              step={step}
              onImageAdd={() => {}} // Define the function or remove it if not necessary
              setStep={setStepState}
            />
          )}
        </div>
      </DndProvider>
    );
  }
);
RealPopup.displayName = "RealPopup";

export default RealPopup;
