import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from "react";
import { ElementProps, TopBarConfig } from "../../common-components-builder/Types";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import { moveElement } from "../../common-components-builder/MoveElement";
import { useDropWrapper } from "../../common-components-builder/UseDropWrapper";
import { desktopStyle, mobileStyle } from "./Styles";

interface TopBarPreviewProps {
  desktopStepOneElements: ElementProps[];
  setDesktopStepOneElements: React.Dispatch<React.SetStateAction<ElementProps[]>>;
  mobileStepOneElements: ElementProps[];
  setMobileStepOneElements: React.Dispatch<React.SetStateAction<ElementProps[]>>;
  desktopStepTwoElements: ElementProps[];
  setDesktopStepTwoElements: React.Dispatch<React.SetStateAction<ElementProps[]>>;
  mobileStepTwoElements: ElementProps[];
  setMobileStepTwoElements: React.Dispatch<React.SetStateAction<ElementProps[]>>;
  view: "desktop" | "mobile";
  desktopConfigStepOne: TopBarConfig;
  desktopConfigStepTwo: TopBarConfig;
  mobileConfigStepOne: TopBarConfig;
  mobileConfigStepTwo: TopBarConfig;
  step: number;
  setUrl: React.Dispatch<React.SetStateAction<string>>;
  url: string;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  allowStepChange?: boolean;
  isStepTwoAvailable: boolean;
  enableDragAndDrop: boolean;
  forceMobileView?: boolean;
}

const TopBarPreview = forwardRef(
  (
    {
      desktopStepOneElements,
      setDesktopStepOneElements,
      mobileStepOneElements,
      setMobileStepOneElements,
      desktopStepTwoElements,
      setDesktopStepTwoElements,
      mobileStepTwoElements,
      setMobileStepTwoElements,
      view: initialView,
      desktopConfigStepOne,
      desktopConfigStepTwo,
      mobileConfigStepOne,
      mobileConfigStepTwo,
      step,
      setUrl,
      url,
      setStep,
      allowStepChange = false,
      isStepTwoAvailable,
      enableDragAndDrop,
      forceMobileView = false,
    }: TopBarPreviewProps,
    ref
  ) => {
    const [hoverIndex, setHoverIndex] = useState<number | null>(null);
    const [view, setView] = useState<"desktop" | "mobile">(
      forceMobileView ? "mobile" : initialView
    );

    // Refs for each combination
    const containerRefDesktopStepOne = useRef<HTMLDivElement>(null);
    const containerRefMobileStepOne = useRef<HTMLDivElement>(null);
    const containerRefDesktopStepTwo = useRef<HTMLDivElement>(null);
    const containerRefMobileStepTwo = useRef<HTMLDivElement>(null);

    // Determine which configuration to use based on the view and step
    const configStepOne = view === "desktop" ? desktopConfigStepOne : mobileConfigStepOne;
    const configStepTwo = view === "desktop" ? desktopConfigStepTwo : mobileConfigStepTwo;

    // Compile HTML
    const compileHtml = useCallback(
      (ref: React.RefObject<HTMLDivElement>, config: TopBarConfig) => {
        if (ref.current) {
          const html = ref.current.innerHTML;
          return `<div style="background:${config.backgroundColor};  height:${config.height}; width:100%;  display:flex; justify-content:center; align-items:center;">${html}</div>`;
        }
        return "";
      },
      []
    );

    const getCompiledHtml = useCallback(() => {
      const htmlDesktopStepOne = compileHtml(containerRefDesktopStepOne, desktopConfigStepOne);
      const htmlMobileStepOne = compileHtml(containerRefMobileStepOne, mobileConfigStepOne);
      const htmlDesktopStepTwo = compileHtml(containerRefDesktopStepTwo, desktopConfigStepTwo);
      const htmlMobileStepTwo = compileHtml(containerRefMobileStepTwo, mobileConfigStepTwo);

      return {
        desktopStepOne: htmlDesktopStepOne,
        mobileStepOne: htmlMobileStepOne,
        desktopStepTwo: htmlDesktopStepTwo,
        mobileStepTwo: htmlMobileStepTwo,
      };
    }, [
      compileHtml,
      desktopConfigStepOne,
      desktopConfigStepTwo,
      mobileConfigStepOne,
      mobileConfigStepTwo,
    ]);

    useImperativeHandle(ref, () => ({
      getCompiledHtml,
    }));

    // Use DropWrapper for drag and drop functionality
    const dropWrapperDesktopStepOne = useDropWrapper(
      enableDragAndDrop,
      1,
      desktopStepOneElements,
      setDesktopStepOneElements,
      setHoverIndex,
      hoverIndex
    );

    const dropWrapperMobileStepOne = useDropWrapper(
      enableDragAndDrop,
      1,
      mobileStepOneElements,
      setMobileStepOneElements,
      setHoverIndex,
      hoverIndex
    );

    const dropWrapperDesktopStepTwo = useDropWrapper(
      enableDragAndDrop,
      2,
      desktopStepTwoElements,
      setDesktopStepTwoElements,
      setHoverIndex,
      hoverIndex
    );

    const dropWrapperMobileStepTwo = useDropWrapper(
      enableDragAndDrop,
      2,
      mobileStepTwoElements,
      setMobileStepTwoElements,
      setHoverIndex,
      hoverIndex
    );

    // Conditional rendering logic based on `step`
    return (
      <div>
        {/* Always render Step One */}
        <div style={{ display: step === 1 ? "block" : "none" }}>
          {/* Desktop Step One */}
          <div
            ref={dropWrapperDesktopStepOne.drop as unknown as React.RefObject<HTMLDivElement>}
            className={`top-bar-preview px-2 flex items-center relative ${dropWrapperDesktopStepOne.isOver ? "bg-gray-100" : ""}`}
            style={view === "desktop" ? desktopStyle(desktopConfigStepOne) : { display: "none" }}
          >
            <div
              className="flex h-full items-center justify-center gap-4"
              ref={containerRefDesktopStepOne}
              style={{
                flexWrap: "nowrap",
                width: "100%",
                overflowX: view === "desktop" ? "auto" : "hidden",
                overflowY: "hidden",
              }}
            >
              <StepOne
                elements={desktopStepOneElements}
                setElements={setDesktopStepOneElements}
                moveElement={(dragIndex, hoverIndex) =>
                  moveElement(
                    desktopStepOneElements,
                    setDesktopStepOneElements,
                    dragIndex,
                    hoverIndex
                  )
                }
                hoverIndex={hoverIndex}
                elementWidth={
                  100 / ((desktopStepOneElements?.length || 0) + (hoverIndex !== null ? 1 : 0)) +
                  "%"
                }
                onRemove={(id) =>
                  setDesktopStepOneElements((prevElements) =>
                    prevElements.filter((element) => element.id !== id)
                  )
                }
                view="desktop"
                setUrl={setUrl}
                setStep={setStep}
                allowStepChange={allowStepChange}
                enableDragAndDrop={enableDragAndDrop}
              />
            </div>
          </div>

          {/* Mobile Step One */}
          <div
            ref={dropWrapperMobileStepOne.drop as unknown as React.RefObject<HTMLDivElement>}
            className={`top-bar-preview px-2 flex  items-center relative ${dropWrapperMobileStepOne.isOver ? "bg-gray-100" : ""}`}
            style={view === "mobile" ? mobileStyle(mobileConfigStepOne) : { display: "none" }}
          >
            <div
              className="flex h-full items-center justify-center gap-4 "
              ref={containerRefMobileStepOne}
              style={{
                flexWrap: "nowrap",
                width: "100%",
                overflowX: view === "desktop" ? "auto" : "hidden",
                overflowY: "hidden",
              }}
            >
              <StepOne
                elements={mobileStepOneElements}
                setElements={setMobileStepOneElements}
                moveElement={(dragIndex, hoverIndex) =>
                  moveElement(
                    mobileStepOneElements,
                    setMobileStepOneElements,
                    dragIndex,
                    hoverIndex
                  )
                }
                hoverIndex={hoverIndex}
                elementWidth={
                  100 / (mobileStepOneElements?.length + (hoverIndex !== null ? 1 : 0)) + "%"
                }
                onRemove={(id) =>
                  setMobileStepOneElements((prevElements) =>
                    prevElements.filter((element) => element.id !== id)
                  )
                }
                view="mobile"
                setUrl={setUrl}
                setStep={setStep}
                allowStepChange={allowStepChange}
                enableDragAndDrop={enableDragAndDrop}
              />
            </div>
          </div>
        </div>

        {/* Always render Step Two */}
        <div
          id="parent-div" // This is the parent div where you want the scroll
          style={{
            display: step === 2 ? "block" : "none", // Conditionally rendered based on step
            overflowX: "auto", // Enable horizontal scrolling here
            width: "100%", // Full width to allow scrolling
            height: "100%", // Full height (adjust as necessary)
          }}
          onScroll={(e) => {
            // Check if the parent div is scrolled horizontally
            if (e.currentTarget.scrollLeft > 0) {
            }
          }}
        >
          {/* Desktop Step Two */}
          <div
            ref={dropWrapperDesktopStepTwo.drop as unknown as React.RefObject<HTMLDivElement>}
            className={`top-bar-preview px-2 flex items-center relative ${dropWrapperDesktopStepTwo.isOver ? "bg-gray-100" : ""}`}
            style={view === "desktop" ? desktopStyle(desktopConfigStepTwo) : { display: "none" }}
          >
            <div
              className="overflow-x-auto h-full w-full"
              style={{
                overflowX: "hidden", // Hide horizontal scrolling
                overflowY: "hidden", // Allow vertical scrolling
              }} // Allow horizontal scrolling
              onScroll={(e) => {
                if (e.currentTarget.scrollLeft > 0) {
                }
              }}
            >
              <div
                className="flex h-full items-center justify-center gap-4"
                ref={containerRefDesktopStepTwo}
                style={{
                  flexWrap: "nowrap",
                  width: "max-content",
                }}
              >
                <StepTwo
                  elements={desktopStepTwoElements}
                  setElements={setDesktopStepTwoElements}
                  moveElement={(dragIndex, hoverIndex) =>
                    moveElement(
                      desktopStepTwoElements,
                      setDesktopStepTwoElements,
                      dragIndex,
                      hoverIndex
                    )
                  }
                  hoverIndex={hoverIndex}
                  elementWidth={
                    100 / (desktopStepTwoElements?.length + (hoverIndex !== null ? 1 : 0)) + "%"
                  }
                  onRemove={(id) =>
                    setDesktopStepTwoElements((prevElements) =>
                      prevElements.filter((element) => element.id !== id)
                    )
                  }
                  view="desktop"
                />
              </div>
            </div>
          </div>

          {/* Mobile Step Two */}
          <div
            ref={dropWrapperMobileStepTwo.drop as unknown as React.RefObject<HTMLDivElement>}
            className={`top-bar-preview px-2 flex items-center relative ${dropWrapperMobileStepTwo.isOver ? "bg-gray-100" : ""}`}
            style={view === "mobile" ? mobileStyle(mobileConfigStepTwo) : { display: "none" }}
          >
            <div
              className="flex h-full items-center justify-center gap-4"
              ref={containerRefMobileStepTwo}
              style={{
                flexWrap: "nowrap",
                width: "100%",
                overflowX: view === "desktop" ? "auto" : "hidden",
                overflowY: "hidden",
              }}
            >
              <StepTwo
                elements={mobileStepTwoElements}
                setElements={setMobileStepTwoElements}
                moveElement={(dragIndex, hoverIndex) =>
                  moveElement(
                    mobileStepTwoElements,
                    setMobileStepTwoElements,
                    dragIndex,
                    hoverIndex
                  )
                }
                hoverIndex={hoverIndex}
                elementWidth={
                  100 / (mobileStepTwoElements?.length + (hoverIndex !== null ? 1 : 0)) + "%"
                }
                onRemove={(id) =>
                  setMobileStepTwoElements((prevElements) =>
                    prevElements.filter((element) => element.id !== id)
                  )
                }
                view="mobile"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default TopBarPreview;

TopBarPreview.displayName = "TopBarPreview";
