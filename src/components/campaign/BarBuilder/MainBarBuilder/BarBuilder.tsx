import React, {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useCallback,
} from "react";
import { ElementProps, TopBarConfig } from "../../CommonComponents/Types";
import DragAndDropSection from "../DragAndDropSection";
import CustomizationPanel from "../CustomizationPanel/CustomizationPanel";
import TopBarPreview from "../Preview/TopBarPreview";
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
import { PopupConfig } from "../../CommonComponents/Types";

// Conversion functions
const convertToTopBarConfig = (config: PopupConfig): TopBarConfig => {
  const { borderWidth, ImagePosition, width, ...rest } = config;
  return rest as TopBarConfig;
};

const convertToPopupConfig = (config: TopBarConfig): PopupConfig => {
  return {
    ...config,
    borderWidth: "0px",
    ImagePosition: "center",
    width: "100%",
  } as unknown as PopupConfig;
};

interface BarBuilderProps {
  campaign: {
    name: string;
    url: string;
    startDate: string;
    closeDate: string;
    company: string;
    serializedTopbarState?: string;
    settingsTopbarState?: string;
  };
  className?: string;
}

const initialElements: ElementProps[] = [];

const BarBuilder = forwardRef<unknown, BarBuilderProps>(
  ({ campaign, className }, ref) => {
    const topBarPreviewRef = useRef<any>(null);

    const [desktopStepOneElements, setDesktopStepOneElements] =
      useState<ElementProps[]>(initialElements);
    const [desktopStepTwoElements, setDesktopStepTwoElements] =
      useState<ElementProps[]>(initialElements);
    const [mobileStepOneElements, setMobileStepOneElements] =
      useState<ElementProps[]>(initialElements);
    const [mobileStepTwoElements, setMobileStepTwoElements] =
      useState<ElementProps[]>(initialElements);
    const [previewUrl, setPreviewUrl] = useState<string>(campaign.url);
    const [previewStep, setPreviewStep] = useState<number>(1);
    const [isStepTwoAvailable, setIsStepTwoAvailable] = useState<boolean>(true);

    const [view, setView] = useState<"desktop" | "mobile">("desktop");
    const [isSettingsOpen, setIsSettingsOpen] = useState(true);

    const [desktopConfigStep1, setDesktopConfigStep1] = useState<TopBarConfig>(
      initialDesktopConfigStep1
    );
    const [desktopConfigStep2, setDesktopConfigStep2] = useState<TopBarConfig>(
      initialDesktopConfigStep2
    );
    const [mobileConfigStep1, setMobileConfigStep1] = useState<TopBarConfig>(
      initialMobileConfigStep1
    );
    const [mobileConfigStep2, setMobileConfigStep2] = useState<TopBarConfig>(
      initialMobileConfigStep2
    );

    const overflowRef = useRef<HTMLDivElement>(null);
    const [manualViewChange, setManualViewChange] = useState(false);
    const [key, setKey] = useState<number>(0);

    // Initialize states from serializedTopbarState
    useEffect(() => {
      if (overflowRef.current) {
        const scrollWidth = overflowRef.current.scrollWidth;
        const clientWidth = overflowRef.current.clientWidth;
        overflowRef.current.scrollLeft = (scrollWidth - clientWidth) / 2;
      }
    }, []);

    // Deserialize state if provided
    useEffect(() => {
      if (campaign.serializedTopbarState) {
        const serializedState = JSON.parse(campaign.serializedTopbarState);
        if (serializedState) {
          setDesktopStepOneElements(serializedState.desktopStepOneElements);
          setDesktopStepTwoElements(serializedState.desktopStepTwoElements);
          setMobileStepOneElements(serializedState.mobileStepOneElements);
          setMobileStepTwoElements(serializedState.mobileStepTwoElements);
          setPreviewUrl(serializedState.url);
          setPreviewStep(serializedState.step);
          setIsStepTwoAvailable(serializedState.isStepTwoAvailable);
          setView(serializedState.view);
        }
      }

      if (campaign.settingsTopbarState) {
        const settingsState = JSON.parse(campaign.settingsTopbarState);
        if (settingsState) {
          setDesktopConfigStep1(
            convertToTopBarConfig(
              settingsState.desktopStep1 || initialDesktopConfigStep1
            )
          );
          setDesktopConfigStep2(
            convertToTopBarConfig(
              settingsState.desktopStep2 || initialDesktopConfigStep2
            )
          );
          setMobileConfigStep1(
            convertToTopBarConfig(
              settingsState.mobileStep1 || initialMobileConfigStep1
            )
          );
          setMobileConfigStep2(
            convertToTopBarConfig(
              settingsState.mobileStep2 || initialMobileConfigStep2
            )
          );
        }
      }
    }, [campaign.serializedTopbarState, campaign.settingsTopbarState]);

    // Handle updates for elements
    const handleElementUpdate = (updatedElement: ElementProps) => {
      const elements =
        previewStep === 1
          ? view === "desktop"
            ? desktopStepOneElements
            : mobileStepOneElements
          : view === "desktop"
            ? desktopStepTwoElements
            : mobileStepTwoElements;
      const setElements =
        previewStep === 1
          ? view === "desktop"
            ? setDesktopStepOneElements
            : setMobileStepOneElements
          : view === "desktop"
            ? setDesktopStepTwoElements
            : setMobileStepTwoElements;
      setElements(
        elements.map((element) =>
          element.id === updatedElement.id ? updatedElement : element
        )
      );
    };

    // Toggle settings panel
    const toggleSettings = () => {
      setIsSettingsOpen(!isSettingsOpen);
    };

    // Remove element
    const handleRemoveElement = (elementId: string) => {
      const elements =
        previewStep === 1
          ? view === "desktop"
            ? desktopStepOneElements
            : mobileStepOneElements
          : view === "desktop"
            ? desktopStepTwoElements
            : mobileStepTwoElements;
      const setElements =
        previewStep === 1
          ? view === "desktop"
            ? setDesktopStepOneElements
            : setMobileStepOneElements
          : view === "desktop"
            ? setDesktopStepTwoElements
            : setMobileStepTwoElements;
      setElements((prevElements) =>
        prevElements.filter((element) => element && element.id !== elementId)
      );
    };

    // Get current configuration based on view and step
    const currentConfig =
      view === "desktop"
        ? previewStep === 1
          ? desktopConfigStep1
          : desktopConfigStep2
        : previewStep === 1
          ? mobileConfigStep1
          : mobileConfigStep2;

    // Define height based on view and step
    const currentHeight =
      view === "desktop"
        ? previewStep === 1
          ? desktopConfigStep1.height
          : desktopConfigStep2.height
        : previewStep === 1
          ? mobileConfigStep1.height
          : mobileConfigStep2.height;

    // Serialization and Deserialization functions
    useImperativeHandle(ref, () => ({
      serializeRealTopBar: () => {
        return {
          desktopStepOneElements,
          desktopStepTwoElements,
          mobileStepOneElements,
          mobileStepTwoElements,
          url: previewUrl,
          step: previewStep,
          isStepTwoAvailable,
          view,
        };
      },
      serializeTopbarSettings: () => {
        return {
          desktopStep1: convertToPopupConfig(desktopConfigStep1),
          desktopStep2: convertToPopupConfig(desktopConfigStep2),
          mobileStep1: convertToPopupConfig(mobileConfigStep1),
          mobileStep2: convertToPopupConfig(mobileConfigStep2),
        };
      },
      getCompiledHtml: () => {
        // Get the compiled HTML from the TopBarPreview component
        if (topBarPreviewRef.current) {
          return topBarPreviewRef.current.getCompiledHtml();
        }
        return null;
      },
    }));

    // Handle view changes
    useEffect(() => {
      const handleResize = () => {
        if (!manualViewChange) {
          if (window.innerWidth <= 768) {
            setView("mobile");
          } else {
            setView("desktop");
          }
        }
      };

      window.addEventListener("resize", handleResize);

      handleResize();

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }, [manualViewChange]);

    // View change handler
    const handleViewChange = (newView: "desktop" | "mobile") => {
      setView(newView);
      setManualViewChange(true);
      setKey((prevKey) => prevKey + 1);
    };

    // Update styles on view change
    useEffect(() => {
      if (topBarPreviewRef.current && topBarPreviewRef.current.style) {
        if (view === "mobile") {
          topBarPreviewRef.current.style.width = "375px";
          topBarPreviewRef.current.style.margin = "0 auto";
        } else {
          topBarPreviewRef.current.style.width = "100%";
          topBarPreviewRef.current.style.margin = "0";
        }
      }
    }, [view]);

    return (
      <DndProvider backend={HTML5Backend}>
        <div className={`flex ${className}`}>
          <div className="w-1/4 p-4 max-h-[750px] overflow-y-auto overflow-x-hidden">
            <ViewSelector
              view={view}
              setView={handleViewChange}
              previewStep={previewStep}
              setDesktopConfigStep1={
                setDesktopConfigStep1 as unknown as React.Dispatch<
                  React.SetStateAction<PopupConfig>
                >
              }
              setDesktopConfigStep2={
                setDesktopConfigStep2 as unknown as React.Dispatch<
                  React.SetStateAction<PopupConfig>
                >
              }
              setMobileConfigStep1={
                setMobileConfigStep1 as unknown as React.Dispatch<
                  React.SetStateAction<PopupConfig>
                >
              }
              setMobileConfigStep2={
                setMobileConfigStep2 as unknown as React.Dispatch<
                  React.SetStateAction<PopupConfig>
                >
              }
            />
            <SettingsPanel
              isOpen={isSettingsOpen}
              toggleSettings={toggleSettings}
              config={currentConfig}
              view={view}
              previewStep={previewStep}
              setDesktopConfigStep1={setDesktopConfigStep1}
              setDesktopConfigStep2={setDesktopConfigStep2}
              setMobileConfigStep1={setMobileConfigStep1}
              setMobileConfigStep2={setMobileConfigStep2}
            />
            <DragAndDropSection />
            <CustomizationPanel
              view={view}
              elements={
                previewStep === 1
                  ? view === "desktop"
                    ? desktopStepOneElements
                    : mobileStepOneElements
                  : view === "desktop"
                    ? desktopStepTwoElements
                    : mobileStepTwoElements
              }
              onUpdate={handleElementUpdate}
              onRemove={handleRemoveElement}
            />
          </div>
          <div className="w-3/4 p-4">
            <StepSelector step={previewStep} setStep={setPreviewStep} />
            <div
              ref={overflowRef}
              className="mt-4 custom-scrollbar overflow-x-auto overflow-y-hidden max-w-[980px] relative"
              style={{ height: `${currentHeight}` }}
            >
              <div ref={topBarPreviewRef}>
                <TopBarPreview
                  key={key}
                  ref={topBarPreviewRef}
                  desktopStepOneElements={desktopStepOneElements}
                  setDesktopStepOneElements={setDesktopStepOneElements}
                  mobileStepOneElements={mobileStepOneElements}
                  setMobileStepOneElements={setMobileStepOneElements}
                  desktopStepTwoElements={desktopStepTwoElements}
                  setDesktopStepTwoElements={setDesktopStepTwoElements}
                  mobileStepTwoElements={mobileStepTwoElements}
                  setMobileStepTwoElements={setMobileStepTwoElements}
                  view={view}
                  desktopConfigStepOne={desktopConfigStep1}
                  desktopConfigStepTwo={desktopConfigStep2}
                  mobileConfigStepOne={mobileConfigStep1}
                  mobileConfigStepTwo={mobileConfigStep2}
                  step={previewStep}
                  setUrl={setPreviewUrl}
                  url={previewUrl}
                  setStep={setPreviewStep}
                  allowStepChange={true}
                  isStepTwoAvailable={isStepTwoAvailable}
                  enableDragAndDrop={true}
                  forceMobileView={view === "mobile"}
                />
              </div>
            </div>
          </div>
        </div>
      </DndProvider>
    );
  }
);

BarBuilder.displayName = "BarBuilder";

export default BarBuilder;
