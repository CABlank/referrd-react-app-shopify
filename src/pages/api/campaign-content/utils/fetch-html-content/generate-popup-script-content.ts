import { createSendFormDataFunction, createSpinnerFunction } from "./index";

export function generatePopupScriptContent(campaignData: any, settings: any) {
  const sendFormDataFunction = createSendFormDataFunction();
  const spinnerFunction = createSpinnerFunction();

  return `
    (function() {
      ${sendFormDataFunction}
      ${spinnerFunction}

      console.log("Script Loaded: Initializing Popup Campaign...");

      const campaignData = ${JSON.stringify(campaignData)};
      const settings = ${JSON.stringify(settings)};
      const compiledHtml = campaignData.compiledHtml ? JSON.parse(campaignData.compiledHtml) : {};

      const createPopupElement = () => {
        console.log("Creating Popup Element...");

        const popupElement = document.createElement('div');
        popupElement.id = 'campaign';
        popupElement.style.position = 'fixed';
        popupElement.style.top = '50%';
        popupElement.style.left = '50%';
        popupElement.style.transform = 'translate(-50%, -50%)';
        popupElement.style.width = settings.desktopStep1.width;
        popupElement.style.height = settings.desktopStep1.height;
        popupElement.style.backgroundColor = settings.desktopStep1.backgroundColor;
        popupElement.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
        popupElement.style.borderRadius = (parseInt(settings.desktopStep1.borderWidth) + 2) + 'px';
        popupElement.style.zIndex = '9999';

        const closeButton = document.createElement('button');
        closeButton.innerHTML = '&times;';
        closeButton.id = 'close-button';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '10px';
        closeButton.style.right = '10px';
        closeButton.style.backgroundColor = 'transparent';
        closeButton.style.border = 'none';
        closeButton.style.fontSize = '24px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.zIndex = '10000';

        closeButton.addEventListener('click', () => {
          console.log('Close button clicked');
          popupElement.style.display = 'none';
          const overlay = document.getElementById('overlay');
          if (overlay) overlay.style.display = 'none';
        });

        popupElement.appendChild(closeButton);
        document.body.appendChild(popupElement);

        const isMobile = window.innerWidth <= 650;
        const htmlContentStepOne = isMobile ? compiledHtml.mobileStepOne : compiledHtml.desktopStepOne;
        const htmlContentStepTwo = isMobile ? compiledHtml.mobileStepTwo : compiledHtml.desktopStepTwo;

        const stepOneWrapper = document.createElement('div');
        stepOneWrapper.id = 'step-one-wrapper';
        stepOneWrapper.innerHTML = htmlContentStepOne;
        stepOneWrapper.style.display = 'block';
        popupElement.appendChild(stepOneWrapper);

        const stepTwoWrapper = document.createElement('div');
        stepTwoWrapper.id = 'step-two-wrapper';
        stepTwoWrapper.innerHTML = ''; // Initially empty to avoid showing placeholders
        stepTwoWrapper.style.display = 'none';
        popupElement.appendChild(stepTwoWrapper);

        // Create and append the spinner using the function defined earlier
        const spinner = createSpinner();
        popupElement.appendChild(spinner);
        console.log("Spinner created and appended:", spinner);

        const overlay = document.createElement('div');
        overlay.id = 'overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
        overlay.style.zIndex = '9998';
        document.body.appendChild(overlay);

        applyPopupSettings(1, isMobile);

        const submitButton = stepOneWrapper.querySelector("#submit-button");
        if (submitButton) {
          submitButton.addEventListener("click", (event) => {
            event.preventDefault();

            // Hide step one and show spinner immediately
            stepOneWrapper.style.display = 'none';
            spinner.style.display = 'block';
            console.log("Spinner displayed");

            const formData = {};

            // Capture input data as the user types
            const inputs = stepOneWrapper.querySelectorAll('input[name]');
            inputs.forEach(input => {
              const inputName = input.name;
              formData[inputName] = input.value;
            });

            // Add metadata
            formData.metadata = JSON.stringify({
              origin: window.location.origin,
              referrer: document.referrer,
              timestamp: new Date().toISOString(),
            });

            // Add campaign-specific data to formData
            formData.campaign_uuid = campaignData.campaign_uuid;
            formData.company_id = campaignData.company_id;

            console.log('Form submitted with data:', formData);

            sendFormData('https://app.referrd.com.au/api/campaign-content/submit-form', formData, htmlContentStepTwo, stepTwoWrapper, spinner, () => {
              goToPopupStep2(stepOneWrapper, stepTwoWrapper);  // Correct function call
            });

          });
        }
      };

      const applyPopupSettings = (step, isMobile) => {
        console.log(\`Applying Popup settings for step \${step}...\`);
        let settingsStep;

        settingsStep = isMobile ? (step === 1 ? settings.mobileStep1 : settings.mobileStep2) : (step === 1 ? settings.desktopStep1 : settings.desktopStep2);
        console.log('Popup Settings:', settingsStep);

        const popupElement = document.getElementById('campaign');
        if (popupElement && settingsStep) {
          popupElement.style.backgroundColor = settingsStep.backgroundColor;
          popupElement.style.width = settingsStep.width;
          popupElement.style.height = settingsStep.height;
          popupElement.style.borderRadius = (parseInt(settingsStep.borderWidth) + 2) + 'px';
        }
      };

      const goToPopupStep2 = (stepOneWrapper, stepTwoWrapper) => {
        console.log("Transitioning to Popup Step Two...");

        stepOneWrapper.style.display = "none";
        stepTwoWrapper.style.display = "block";

        const spinner = document.getElementById("spinner");
        if (spinner) spinner.style.display = 'none';

        const isMobile = window.innerWidth <= 650;
        applyPopupSettings(2, isMobile);
      };

      // Initialize the Popup
      createPopupElement();

      // Handle window resize events
      window.addEventListener('resize', function() {
        const currentStep = document.querySelector("#step-two-wrapper")?.style.display === "block" ? 2 : 1;
        const isMobile = window.innerWidth <= 650;
        applyPopupSettings(currentStep, isMobile);
      });

      // Handle postMessage events for Popup
      window.addEventListener('message', function(event) {
        console.log("Popup Received message:", event.data);
        if (event.data === 'goToStep2') {
          const stepOneWrapper = document.getElementById('step-one-wrapper');
          const stepTwoWrapper = document.getElementById('step-two-wrapper');
          const isMobile = window.innerWidth <= 650;
          goToPopupStep2(stepOneWrapper, stepTwoWrapper);
        }
      });

    })();
  `;
}
