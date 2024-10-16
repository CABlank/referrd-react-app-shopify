import React, {
  useState,
  ChangeEvent,
  forwardRef,
  useImperativeHandle,
  useEffect,
  useRef,
} from "react";
import { ElementProps, PopupConfig } from "../../common-components-builder/Types";
import DragAndDropSection from "../DragAndDropSection";
import CustomizationPanel from "../customization-panel/CustomizationPanel";
import PopupPreview from "../preview/PopupPreview";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import ViewSelector from "../../common-components-builder/ViewSelector";
import StepSelector from "../../common-components-builder/StepSelector";
import SettingsPanel, {
  initialDesktopConfigStep1,
  initialDesktopConfigStep2,
  initialMobileConfigStep1,
  initialMobileConfigStep2,
} from "./SettingsPanel";
import { updateErrorMessage, clearErrorMessage } from "../../../CampaignCreativeSelector";

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

const PopupBuilder = forwardRef<unknown, PopupBuilderProps>(({ className, campaign }, ref) => {
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

  const [desktopConfigStep1, setDesktopConfigStep1] =
    useState<PopupConfig>(initialDesktopConfigStep1);
  const [desktopConfigStep2, setDesktopConfigStep2] =
    useState<PopupConfig>(initialDesktopConfigStep2);
  const [mobileConfigStep1, setMobileConfigStep1] = useState<PopupConfig>(initialMobileConfigStep1);
  const [mobileConfigStep2, setMobileConfigStep2] = useState<PopupConfig>(initialMobileConfigStep2);

  const [imageRecentlyAdded, setImageRecentlyAdded] = useState(false);

  useEffect(() => {
    // Function to update view and step based on the current substep
    const updateViewAndStep = () => {
      const subStep = document.body.getAttribute("data-current-substep");
      const subStepNumber = parseInt(subStep || "0", 10);

      if (subStepNumber === 1) {
        setView("desktop"); // Set view to desktop
        setStep(1); // Set step to 1
      } else if (subStepNumber === 2) {
        setView("desktop"); // Set view to desktop
        setStep(2); // Set step to 2
      } else if (subStepNumber === 3) {
        setView("mobile"); // Set view to mobile
        setStep(1); // Set step to 1
      } else if (subStepNumber === 4) {
        setView("mobile"); // Set view to mobile
        setStep(2); // Set step to 2
      }
    };

    // Initial update when component mounts
    updateViewAndStep();

    // Use MutationObserver to monitor changes in "data-current-substep"
    const observer = new MutationObserver(() => {
      updateViewAndStep(); // Update when the attribute changes
    });

    // Observe "data-current-substep" on the body
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["data-current-substep"],
    });

    // Cleanup observer on component unmount
    return () => observer.disconnect();
  }, []);

  const containerRefDesktopStepOne = useRef<HTMLDivElement>(null);
  const containerRefDesktopStepTwo = useRef<HTMLDivElement>(null);
  const containerRefMobileStepOne = useRef<HTMLDivElement>(null);
  const containerRefMobileStepTwo = useRef<HTMLDivElement>(null);

  const [compiledHtmlDesktopStepOne, setCompiledHtmlDesktopStepOne] = useState<string>("");
  const [compiledHtmlDesktopStepTwo, setCompiledHtmlDesktopStepTwo] = useState<string>("");
  const [compiledHtmlMobileStepOne, setCompiledHtmlMobileStepOne] = useState<string>("");
  const [compiledHtmlMobileStepTwo, setCompiledHtmlMobileStepTwo] = useState<string>("");

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
      elements.map((element) => (element.id === updatedElement.id ? updatedElement : element))
    );
  };

  const handleConfigChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (view === "desktop") {
      const setConfig = step === 1 ? setDesktopConfigStep1 : setDesktopConfigStep2;
      setConfig((prevConfig) => ({ ...prevConfig, [name]: value }));
    } else {
      const setConfig = step === 1 ? setMobileConfigStep1 : setMobileConfigStep2;
      setConfig((prevConfig) => ({ ...prevConfig, [name]: value }));
    }
  };

  const handleValueChange = (
    e: ChangeEvent<HTMLInputElement>,
    type: "height" | "width" | "borderWidth" | "backgroundColor" | "ImagePosition"
  ) => {
    const { value } = e.target;
    if (view === "desktop") {
      const setConfig = step === 1 ? setDesktopConfigStep1 : setDesktopConfigStep2;
      setConfig((prevConfig) => ({ ...prevConfig, [type]: `${value}px` }));
    } else {
      const setConfig = step === 1 ? setMobileConfigStep1 : setMobileConfigStep2;
      setConfig((prevConfig) => ({ ...prevConfig, [type]: `${value}px` }));
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

    setElements((prevElements) => prevElements.filter((element) => element.id !== elementId));
  };

  const handleImageAdd = () => {
    setIsSettingsOpen(false);
    setImageRecentlyAdded(true);
  };

  const compileHtmlDesktopStepOne = () => {
    if (containerRefDesktopStepOne.current) {
      const html = containerRefDesktopStepOne.current.innerHTML;
      const wrapper = document.createElement("div");
      wrapper.innerHTML = html;
      const popupContent = wrapper.querySelector(".popup-content") as HTMLElement;
      if (popupContent) {
        popupContent.style.flexDirection = "row"; // Ensure row direction for desktop
      }
      setCompiledHtmlDesktopStepOne(wrapper.innerHTML);
    }
  };

  const compileHtmlDesktopStepTwo = () => {
    if (containerRefDesktopStepTwo.current) {
      const html = containerRefDesktopStepTwo.current.innerHTML;
      setCompiledHtmlDesktopStepTwo(html);
    }
  };

  const compileHtmlMobileStepOne = () => {
    if (containerRefMobileStepOne.current) {
      const html = containerRefMobileStepOne.current.innerHTML;
      const wrapper = document.createElement("div");
      wrapper.innerHTML = html;

      // Ensure column direction for mobile in popup content
      const popupContent = wrapper.querySelector(".popup-content") as HTMLElement | null;
      if (popupContent) {
        popupContent.style.flexDirection = "column";
      }

      // Add styles to elements with the class 'image-drop'
      const imageDropElements = wrapper.querySelectorAll(".image-drop") as NodeListOf<HTMLElement>;
      imageDropElements.forEach((element) => {
        element.style.removeProperty("width"); // Remove existing width property
        element.style.width = "100%";
        element.style.height = "16rem";
      });

      setCompiledHtmlMobileStepOne(wrapper.innerHTML);
    }
  };

  const compileHtmlMobileStepTwo = () => {
    if (containerRefMobileStepTwo.current) {
      const html = containerRefMobileStepTwo.current.innerHTML;
      setCompiledHtmlMobileStepTwo(html);
    }
  };

  // Deserialization on mount
  useEffect(() => {
    if (campaign.serializedPopupState) {
      const serializedState = JSON.parse(campaign.serializedPopupState);
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
      const settingsState = JSON.parse(campaign.settingsPopupState);
      if (settingsState) {
        setDesktopConfigStep1(settingsState.desktopStep1 || initialDesktopConfigStep1);
        setDesktopConfigStep2(settingsState.desktopStep2 || initialDesktopConfigStep2);
        setMobileConfigStep1(settingsState.mobileStep1 || initialMobileConfigStep1);
        setMobileConfigStep2(settingsState.mobileStep2 || initialMobileConfigStep2);
      }
    }

    compileHtmlDesktopStepOne();
    compileHtmlDesktopStepTwo();
    compileHtmlMobileStepOne();
    compileHtmlMobileStepTwo();
  }, [campaign.serializedPopupState, campaign.settingsPopupState]);

  useEffect(() => {
    compileHtmlDesktopStepOne();
  }, [desktopStepOneElements, desktopConfigStep1]);

  useEffect(() => {
    compileHtmlDesktopStepTwo();
  }, [desktopStepTwoElements, desktopConfigStep2]);

  useEffect(() => {
    compileHtmlMobileStepOne();
  }, [mobileStepOneElements, mobileConfigStep1]);

  useEffect(() => {
    compileHtmlMobileStepTwo();
  }, [mobileStepTwoElements, mobileConfigStep2]);

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
      return state;
    },
    serializePopupSettings: () => {
      const state = {
        desktopStep1: desktopConfigStep1,
        desktopStep2: desktopConfigStep2,
        mobileStep1: mobileConfigStep1,
        mobileStep2: mobileConfigStep2,
      };
      return state;
    },
    getCompiledHtml: () => {
      return {
        desktopStepOne: compiledHtmlDesktopStepOne,
        desktopStepTwo: compiledHtmlDesktopStepTwo,
        mobileStepOne: compiledHtmlMobileStepOne,
        mobileStepTwo: compiledHtmlMobileStepTwo,
      };
    },
    deserializeRealPopUp: (serializedState: any) => {
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
      if (settingsState) {
        setDesktopConfigStep1(settingsState.desktopStep1 || initialDesktopConfigStep1);
        setDesktopConfigStep2(settingsState.desktopStep2 || initialDesktopConfigStep2);
        setMobileConfigStep1(settingsState.mobileStep1 || initialMobileConfigStep1);
        setMobileConfigStep2(settingsState.mobileStep2 || initialMobileConfigStep2);
      }
    },
  }));

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={`flex ${className}`}>
        <div className="w-1/4 p-4  max-h-[750px] overflow-y-auto overflow-x-hidden">
          <ViewSelector
            view={view}
            setView={(newView) => {
              setView(newView);
              compileHtmlDesktopStepOne();
              compileHtmlDesktopStepTwo();
              compileHtmlMobileStepOne();
              compileHtmlMobileStepTwo();
            }}
            previewStep={step}
            setDesktopConfigStep1={setDesktopConfigStep1}
            setDesktopConfigStep2={setDesktopConfigStep2}
            setMobileConfigStep1={setMobileConfigStep1}
            setMobileConfigStep2={setMobileConfigStep2}
          />
          <SettingsPanel
            isOpen={isSettingsOpen}
            toggleSettings={toggleSettings}
            config={
              view === "desktop"
                ? step === 1
                  ? desktopConfigStep1
                  : desktopConfigStep2
                : step === 1
                  ? mobileConfigStep1
                  : mobileConfigStep2
            }
            handleConfigChange={handleConfigChange}
            handleValueChange={handleValueChange}
          />
          <DragAndDropSection />
          <CustomizationPanel
            view={view}
            elements={
              step === 1
                ? view === "desktop"
                  ? desktopStepOneElements
                  : mobileStepOneElements
                : view === "desktop"
                  ? desktopStepTwoElements
                  : mobileStepTwoElements
            }
            onUpdate={handleElementUpdate}
            onRemove={handleRemoveElement}
            imageRecentlyAdded={imageRecentlyAdded}
            setImageRecentlyAdded={setImageRecentlyAdded}
          />
        </div>
        <div className="w-3/4 p-4">
          <StepSelector step={step} setStep={setStep} />

          <div className="mt-4 flex justify-center items-center bg-gray-100 border-2 border-gray-200 relative h-[580px]">
            <div
              ref={containerRefDesktopStepOne}
              className="w-full h-full absolute content-center top-0 left-0"
              style={{
                display: view === "desktop" && step === 1 ? "block" : "none",
              }}
            >
              <PopupPreview
                stepOneElements={desktopStepOneElements}
                setStepOneElements={setDesktopStepOneElements}
                stepTwoElements={desktopStepTwoElements}
                setStepTwoElements={setDesktopStepTwoElements}
                view={view}
                config={desktopConfigStep1}
                step={1}
                onImageAdd={handleImageAdd}
                setStep={setStep}
                onElementsChange={compileHtmlDesktopStepOne}
              />
            </div>
            <div
              ref={containerRefDesktopStepTwo}
              className="w-full h-full absolute top-0 left-0"
              style={{
                display: view === "desktop" && step === 2 ? "block" : "none",
              }}
            >
              <PopupPreview
                stepOneElements={desktopStepOneElements}
                setStepOneElements={setDesktopStepOneElements}
                stepTwoElements={desktopStepTwoElements}
                setStepTwoElements={setDesktopStepTwoElements}
                view={view}
                config={desktopConfigStep2}
                step={2}
                onImageAdd={handleImageAdd}
                setStep={setStep}
                onElementsChange={compileHtmlDesktopStepTwo}
              />
            </div>
            <div
              ref={containerRefMobileStepOne}
              className="w-full h-full absolute top-0 left-0"
              style={{
                display: view === "mobile" && step === 1 ? "block" : "none",
              }}
            >
              <PopupPreview
                stepOneElements={mobileStepOneElements}
                setStepOneElements={setMobileStepOneElements}
                stepTwoElements={mobileStepTwoElements}
                setStepTwoElements={setMobileStepTwoElements}
                view={view}
                config={mobileConfigStep1}
                step={1}
                onImageAdd={handleImageAdd}
                setStep={setStep}
                onElementsChange={compileHtmlMobileStepOne}
              />
            </div>
            <div
              ref={containerRefMobileStepTwo}
              className="w-full h-full absolute top-0 left-0"
              style={{
                display: view === "mobile" && step === 2 ? "block" : "none",
              }}
            >
              <PopupPreview
                stepOneElements={mobileStepOneElements}
                setStepOneElements={setMobileStepOneElements}
                stepTwoElements={mobileStepTwoElements}
                setStepTwoElements={setMobileStepTwoElements}
                view={view}
                config={mobileConfigStep2}
                step={2}
                onImageAdd={handleImageAdd}
                setStep={setStep}
                onElementsChange={compileHtmlMobileStepTwo}
              />
            </div>
          </div>
          <div style={{ display: "none" }}>
            <div>
              <h2>Compiled HTML - Desktop Step One:</h2>
              <div
                dangerouslySetInnerHTML={{
                  __html: compiledHtmlDesktopStepOne,
                }}
              />
              <h2>Compiled HTML - Desktop Step Two:</h2>
              <div
                dangerouslySetInnerHTML={{
                  __html: compiledHtmlDesktopStepTwo,
                }}
              />
              <h2>Compiled HTML - Mobile Step One:</h2>
              <div
                dangerouslySetInnerHTML={{
                  __html: compiledHtmlMobileStepOne,
                }}
              />
              <h2>Compiled HTML - Mobile Step Two:</h2>
              <div
                dangerouslySetInnerHTML={{
                  __html: compiledHtmlMobileStepTwo,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
});

PopupBuilder.displayName = "PopupBuilder";

export default PopupBuilder;
