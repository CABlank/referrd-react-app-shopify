import React, {
  useEffect,
  useImperativeHandle,
  useState,
  forwardRef,
} from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ElementProps, TopBarConfig } from "../../CommonComponents/Types";
import TopBarPreview from "./TopBarPreview";
import { compress, decompress } from "compress-json";

interface RealTopBarProps {
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
}

const RealTopBar = forwardRef<unknown, RealTopBarProps>(
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
    const [config, setConfig] = useState<TopBarConfig | null>(null);
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
        console.log("Deserializing state:", newSerializedState);
        const compressedState = JSON.parse(newSerializedState);
        console.log("Compressed state:", compressedState);
        const deserializedState = JSON.parse(
          JSON.stringify(decompress(compressedState))
        );
        console.log("Decompressed state:", deserializedState);

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
        }
      }

      if (settingsState) {
        try {
          console.log("Settings state provided:", settingsState);
          const deserializedSettings = JSON.parse(settingsState);
          console.log("Deserialized settings:", deserializedSettings);
          const currentConfig = getConfig(
            deserializedSettings,
            initialView,
            initialStep
          );
          console.log("Current config:", currentConfig);
          setConfig(currentConfig);
        } catch (error) {
          console.error("Failed to initialize with settings state:", error);
        }
      }
    }, [serializedState, settingsState, initialView, initialStep]);

    useEffect(() => {
      const handleResize = () => {
        if (!manualViewChange) {
          const newView = window.innerWidth <= 768 ? "mobile" : "desktop";
          console.log("Window resized, new view:", newView);
          setView(newView);
          if (settingsState) {
            const deserializedSettings = JSON.parse(settingsState);
            const newConfig = getConfig(deserializedSettings, newView, step);
            console.log("New config after resize:", newConfig);
            setConfig(newConfig);
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
        console.log("New config after settings state change:", newConfig);
        setConfig(newConfig);
      }
    }, [view, step, settingsState]);

    return (
      <DndProvider backend={HTML5Backend}>
        <div className="real-top-bar-container">
          <div className="frame-root">
            {config && (
              <TopBarPreview
                desktopStepOneElements={desktopStepOneElements}
                setDesktopStepOneElements={setDesktopStepOneElementsState}
                mobileStepOneElements={mobileStepOneElements}
                setMobileStepOneElements={setMobileStepOneElementsState}
                desktopStepTwoElements={desktopStepTwoElements}
                setDesktopStepTwoElements={setDesktopStepTwoElementsState}
                mobileStepTwoElements={mobileStepTwoElements}
                setMobileStepTwoElements={setMobileStepTwoElementsState}
                view={view}
                config={config}
                step={step}
                setUrl={setUrlState}
                url={url}
                setStep={setStepState}
                allowStepChange={true}
                isStepTwoAvailable={isStepTwoAvailable}
                enableDragAndDrop={enableDragAndDrop}
                forceMobileView={view === "mobile"}
              />
            )}
          </div>
        </div>
      </DndProvider>
    );
  }
);

RealTopBar.displayName = "RealTopBar";

export default RealTopBar;
