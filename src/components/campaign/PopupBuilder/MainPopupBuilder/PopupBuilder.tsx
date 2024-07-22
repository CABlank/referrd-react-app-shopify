import React, {
  useState,
  ChangeEvent,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from "react";
import { ElementProps, PopupConfig } from "../../CommonComponents/Types";
import DragAndDropSection from "../DragAndDropSection";
import DesktopCustomizationPanel from "../CustomizationPanel/DesktopCustomizationPanel";
import MobileCustomizationPanel from "../CustomizationPanel/MobileCustomizationPanel";
import PopupPreview from "../Preview/PopupPreview";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import ViewSelector from "../../CommonComponents/ViewSelector";
import StepSelector from "../../CommonComponents/StepSelector";
import SettingsPanel, {
  initialDesktopConfigStep1,
  initialDesktopConfigStep2,
  initialMobileConfigStep1,
  initialMobileConfigStep2,
} from "./SettingsPanel";

const initialElements: ElementProps[] = [];

interface PopupBuilderProps {
  campaign: {
    name: string;
    url: string;
    startDate: string;
    closeDate: string;
    company: string;
    serializedPopupState?: string;
    settingsPopupState?: string;
  };
  className?: string;
}

const PopupBuilder = forwardRef<unknown, PopupBuilderProps>(
  ({ className, campaign }, ref) => {
    const [view, setView] = useState<"desktop" | "mobile">("desktop");
    const [isSettingsOpen, setIsSettingsOpen] = useState(true);
    const [step, setStep] = useState(1);

    const [desktopStepOneElements, setDesktopStepOneElements] =
      useState<ElementProps[]>(initialElements);
    const [desktopStepTwoElements, setDesktopStepTwoElements] =
      useState<ElementProps[]>(initialElements);
    const [mobileStepOneElements, setMobileStepOneElements] =
      useState<ElementProps[]>(initialElements);
    const [mobileStepTwoElements, setMobileStepTwoElements] =
      useState<ElementProps[]>(initialElements);

    const [desktopConfigStep1, setDesktopConfigStep1] = useState<PopupConfig>(
      initialDesktopConfigStep1
    );
    const [desktopConfigStep2, setDesktopConfigStep2] = useState<PopupConfig>(
      initialDesktopConfigStep2
    );
    const [mobileConfigStep1, setMobileConfigStep1] = useState<PopupConfig>(
      initialMobileConfigStep1
    );
    const [mobileConfigStep2, setMobileConfigStep2] = useState<PopupConfig>(
      initialMobileConfigStep2
    );

    const [imageRecentlyAdded, setImageRecentlyAdded] = useState(false);

    const handleElementUpdate = (updatedElement: ElementProps) => {
      const elements =
        view === "desktop"
          ? step === 1
            ? desktopStepOneElements
            : desktopStepTwoElements
          : step === 1
          ? mobileStepOneElements
          : mobileStepTwoElements;
      const setElements =
        view === "desktop"
          ? step === 1
            ? setDesktopStepOneElements
            : setDesktopStepTwoElements
          : step === 1
          ? setMobileStepOneElements
          : setMobileStepTwoElements;

      setElements(
        elements.map((element) =>
          element.id === updatedElement.id ? updatedElement : element
        )
      );
    };

    const handleConfigChange = (
      e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
      const { name, value } = e.target;
      if (view === "desktop") {
        const setConfig =
          step === 1 ? setDesktopConfigStep1 : setDesktopConfigStep2;

        setConfig((prevConfig) => ({
          ...prevConfig,
          [name]: value,
        }));
      } else {
        const setConfig =
          step === 1 ? setMobileConfigStep1 : setMobileConfigStep2;

        setConfig((prevConfig) => ({
          ...prevConfig,
          [name]: value,
        }));
      }
    };

    const handleValueChange = (
      e: ChangeEvent<HTMLInputElement>,
      type: "height" | "width" | "borderWidth"
    ) => {
      const { value } = e.target;
      if (view === "desktop") {
        const setConfig =
          step === 1 ? setDesktopConfigStep1 : setDesktopConfigStep2;

        setConfig((prevConfig) => ({
          ...prevConfig,
          [type]: `${value}px`,
        }));
      } else {
        const setConfig =
          step === 1 ? setMobileConfigStep1 : setMobileConfigStep2;

        setConfig((prevConfig) => ({
          ...prevConfig,
          [type]: `${value}px`,
        }));
      }
    };

    const toggleSettings = () => {
      setIsSettingsOpen(!isSettingsOpen);
    };

    const handleRemoveElement = (elementId: string) => {
      const elements =
        view === "desktop"
          ? step === 1
            ? desktopStepOneElements
            : desktopStepTwoElements
          : step === 1
          ? mobileStepOneElements
          : mobileStepTwoElements;
      const setElements =
        view === "desktop"
          ? step === 1
            ? setDesktopStepOneElements
            : setDesktopStepTwoElements
          : step === 1
          ? setMobileStepOneElements
          : setMobileStepTwoElements;

      setElements((prevElements) =>
        prevElements.filter((element) => element.id !== elementId)
      );
    };

    const handleImageAdd = () => {
      setIsSettingsOpen(false);
      setImageRecentlyAdded(true);
    };

    const currentConfig =
      view === "desktop"
        ? step === 1
          ? desktopConfigStep1
          : desktopConfigStep2
        : step === 1
        ? mobileConfigStep1
        : mobileConfigStep2;

    // Deserialization on mount
    useEffect(() => {
      if (campaign.serializedPopupState) {
        console.log(
          "Serialized Popup State provided:",
          campaign.serializedPopupState
        );
        const serializedState = JSON.parse(campaign.serializedPopupState);
        console.log("Parsed Serialized State:", serializedState);
        if (serializedState) {
          setDesktopStepOneElements(serializedState.desktopStepOneElements);
          setDesktopStepTwoElements(serializedState.desktopStepTwoElements);
          setMobileStepOneElements(serializedState.mobileStepOneElements);
          setMobileStepTwoElements(serializedState.mobileStepTwoElements);
          setStep(serializedState.step);
          setView(serializedState.view);
        }
      }

      if (campaign.settingsPopupState) {
        console.log(
          "Settings Popup State provided:",
          campaign.settingsPopupState
        );
        const settingsState = JSON.parse(campaign.settingsPopupState);
        console.log("Parsed Settings State:", settingsState);
        if (settingsState) {
          setDesktopConfigStep1(
            settingsState.desktopStep1 || initialDesktopConfigStep1
          );
          setDesktopConfigStep2(
            settingsState.desktopStep2 || initialDesktopConfigStep2
          );
          setMobileConfigStep1(
            settingsState.mobileStep1 || initialMobileConfigStep1
          );
          setMobileConfigStep2(
            settingsState.mobileStep2 || initialMobileConfigStep2
          );
        }
      }
    }, [campaign.serializedPopupState, campaign.settingsPopupState]);

    // Serialization and Deserialization methods
    useImperativeHandle(ref, () => ({
      serializeRealPopUp: () => {
        const state = {
          desktopStepOneElements,
          desktopStepTwoElements,
          mobileStepOneElements,
          mobileStepTwoElements,
          step,
          view,
        };
        console.log("Serialized Popup State:", state);
        return state;
      },
      serializePopupSettings: () => {
        const state = {
          desktopStep1: desktopConfigStep1,
          desktopStep2: desktopConfigStep2,
          mobileStep1: mobileConfigStep1,
          mobileStep2: mobileConfigStep2,
        };
        console.log("Serialized Popup Settings:", state);
        return state;
      },
      deserializeRealPopUp: (serializedState: any) => {
        console.log("Deserializing Real Popup State:", serializedState);
        if (serializedState) {
          setDesktopStepOneElements(serializedState.desktopStepOneElements);
          setDesktopStepTwoElements(serializedState.desktopStepTwoElements);
          setMobileStepOneElements(serializedState.mobileStepOneElements);
          setMobileStepTwoElements(serializedState.mobileStepTwoElements);
          setStep(serializedState.step);
          setView(serializedState.view);
        }
      },
      deserializePopupSettings: (settingsState: any) => {
        console.log("Deserializing Popup Settings State:", settingsState);
        if (settingsState) {
          setDesktopConfigStep1(
            settingsState.desktopStep1 || initialDesktopConfigStep1
          );
          setDesktopConfigStep2(
            settingsState.desktopStep2 || initialDesktopConfigStep2
          );
          setMobileConfigStep1(
            settingsState.mobileStep1 || initialMobileConfigStep1
          );
          setMobileConfigStep2(
            settingsState.mobileStep2 || initialMobileConfigStep2
          );
        }
      },
    }));

    return (
      <DndProvider backend={HTML5Backend}>
        <div className={`flex ${className}`}>
          <div className="w-1/4 p-4 border-r max-h-[750px] overflow-y-auto overflow-x-hidden">
            <ViewSelector
              view={view}
              setView={setView}
              previewStep={step}
              setDesktopConfigStep1={setDesktopConfigStep1}
              setDesktopConfigStep2={setDesktopConfigStep2}
              setMobileConfigStep1={setMobileConfigStep1}
              setMobileConfigStep2={setMobileConfigStep2}
            />
            <SettingsPanel
              isOpen={isSettingsOpen}
              toggleSettings={toggleSettings}
              config={currentConfig}
              handleConfigChange={handleConfigChange}
              handleValueChange={handleValueChange}
            />
            <DragAndDropSection />
            {view === "desktop" ? (
              <DesktopCustomizationPanel
                elements={
                  step === 1 ? desktopStepOneElements : desktopStepTwoElements
                }
                onUpdate={handleElementUpdate}
                onRemove={handleRemoveElement}
                imageRecentlyAdded={imageRecentlyAdded}
                setImageRecentlyAdded={setImageRecentlyAdded}
              />
            ) : (
              <MobileCustomizationPanel
                elements={
                  step === 1 ? mobileStepOneElements : mobileStepTwoElements
                }
                onUpdate={handleElementUpdate}
                onRemove={handleRemoveElement}
                imageRecentlyAdded={imageRecentlyAdded}
                setImageRecentlyAdded={setImageRecentlyAdded}
              />
            )}
          </div>
          <div className="w-3/4 p-4">
            <StepSelector step={step} setStep={setStep} />
            <div className="mt-4 flex justify-center items-center bg-gray-100 border-2 border-gray-200 relative h-[580px]">
              <PopupPreview
                stepOneElements={
                  view === "desktop"
                    ? desktopStepOneElements
                    : mobileStepOneElements
                }
                setStepOneElements={
                  view === "desktop"
                    ? setDesktopStepOneElements
                    : setMobileStepOneElements
                }
                stepTwoElements={
                  view === "desktop"
                    ? desktopStepTwoElements
                    : mobileStepTwoElements
                }
                setStepTwoElements={
                  view === "desktop"
                    ? setDesktopStepTwoElements
                    : setMobileStepTwoElements
                }
                view={view}
                config={currentConfig}
                step={step}
                onImageAdd={handleImageAdd}
                setStep={setStep} // Pass setStep to handle step changes
              />
            </div>
          </div>
        </div>
      </DndProvider>
    );
  }
);

PopupBuilder.displayName = "PopupBuilder";

export default PopupBuilder;
