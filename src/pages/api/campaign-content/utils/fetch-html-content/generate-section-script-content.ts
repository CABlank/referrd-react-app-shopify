import { createSendFormDataFunction, createSpinnerFunction } from "./index";

export function generateSectionScriptContent(campaignData: any, settings: any) {
  const sendFormDataFunction = createSendFormDataFunction();
  const spinnerFunction = createSpinnerFunction();

  return `
    (function() {
      ${sendFormDataFunction}
      ${spinnerFunction}

      console.log("Script Loaded: Initializing Section Campaign...");

      const campaignData = ${JSON.stringify(campaignData)};
      const settings = ${JSON.stringify(settings)};
      const compiledHtml = campaignData.compiledHtml ? JSON.parse(campaignData.compiledHtml) : {};

      const createSectionElement = () => {
        console.log("Creating Section Element...");

        const sectionElement = document.createElement('div');
        sectionElement.id = 'campaign-section';
        sectionElement.style.position = 'relative'; // Ensure relative positioning for centering the spinner
        sectionElement.style.width = settings.desktopStep1.width;
        sectionElement.style.height = settings.desktopStep1.height;
        sectionElement.style.backgroundColor = settings.desktopStep1.backgroundColor;
        sectionElement.style.borderRadius = (parseInt(settings.desktopStep1.borderWidth) + 2) + 'px';
        sectionElement.style.margin = '20px auto'; // Center the section with some margin
        sectionElement.style.maxWidth = '100%'; // Ensure it doesn't overflow the page width

        const isMobile = window.innerWidth <= 650;
        const htmlContentStepOne = isMobile ? compiledHtml.mobileStepOne : compiledHtml.desktopStepOne;
        const htmlContentStepTwo = isMobile ? compiledHtml.mobileStepTwo : compiledHtml.desktopStepTwo;

        const stepOneWrapper = document.createElement('div');
        stepOneWrapper.id = 'step-one-wrapper';
        stepOneWrapper.innerHTML = htmlContentStepOne;
        stepOneWrapper.style.display = 'block';
        sectionElement.appendChild(stepOneWrapper);

        const stepTwoWrapper = document.createElement('div');
        stepTwoWrapper.id = 'step-two-wrapper';
        stepTwoWrapper.innerHTML = ''; // Initially empty to avoid showing placeholders
        stepTwoWrapper.style.display = 'none';
        sectionElement.appendChild(stepTwoWrapper);

        // Create and append the spinner using the function defined earlier
        const spinner = createSpinner();
        sectionElement.appendChild(spinner);
        console.log("Spinner created and appended:", spinner);

        const targetElement = document.querySelector('h1.main-page-title.page-title.h0');

        if (targetElement && targetElement.textContent.trim() === 'Referral Page') {
          targetElement.parentNode.insertBefore(sectionElement, targetElement);
          console.log('Section inserted before the target element.');
        } else {
          console.warn('Target element with text "Referral Page" not found.');
          document.body.appendChild(sectionElement);
        }

        applySectionSettings(1, isMobile);

        const submitButton = stepOneWrapper.querySelector("#submit-button");
        if (submitButton) {
          submitButton.addEventListener("click", (event) => {
            event.preventDefault();

            console.log("Submit button clicked");

            // Hide step one and show spinner immediately
            stepOneWrapper.style.display = 'none';
            spinner.style.display = 'flex'; // Ensure the spinner is visible and flex-centered
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

            sendFormData('https://unduly-absolute-cricket.ngrok-free.app/api/campaign-content/submit-form', formData, htmlContentStepTwo, stepTwoWrapper, spinner, () => {
              goToSectionStep2(stepOneWrapper, stepTwoWrapper);  // Correct function call
            });

          });
        }
      };

      const applySectionSettings = (step, isMobile) => {
        console.log(\`Applying Section settings for step \${step}...\`);
        let settingsStep;

        settingsStep = isMobile ? (step === 1 ? settings.mobileStep1 : settings.mobileStep2) : (step === 1 ? settings.desktopStep1 : settings.desktopStep2);
        console.log('Section Settings:', settingsStep);

        const sectionElement = document.getElementById('campaign-section');
        const targetElement = document.querySelector('h1.main-page-title.page-title.h0');

        if (sectionElement && settingsStep) {
          sectionElement.style.backgroundColor = settingsStep.backgroundColor;
          sectionElement.style.width = settingsStep.width;
          sectionElement.style.height = settingsStep.height;
          sectionElement.style.borderRadius = (parseInt(settingsStep.borderWidth) + 2) + 'px';
        }

        if (targetElement && targetElement.textContent.trim() === 'Referral Page') {
          targetElement.parentNode.insertBefore(sectionElement, targetElement.nextSibling);
          console.log('Section inserted after the target element.');
        } else {
          console.warn('Target element with text "Referral Page" not found.');
          document.body.appendChild(sectionElement);
        }
      };

      const goToSectionStep2 = (stepOneWrapper, stepTwoWrapper) => {
        console.log("Transitioning to Section Step Two...");

        stepOneWrapper.style.display = "none";
        stepTwoWrapper.style.display = "block";

        const spinner = document.getElementById("spinner");
        if (spinner) spinner.style.display = 'none';

        const isMobile = window.innerWidth <= 650;
        applySectionSettings(2, isMobile);
      };

      // Initialize the Section
      createSectionElement();

      // Handle window resize events
      window.addEventListener('resize', function() {
        const currentStep = document.querySelector("#step-two-wrapper")?.style.display === "block" ? 2 : 1;
        const isMobile = window.innerWidth <= 650;
        applySectionSettings(currentStep, isMobile);
      });

      // Handle postMessage events for Section
      window.addEventListener('message', function(event) {
        console.log("Section Received message:", event.data);
        if (event.data === 'goToStep2') {
          const stepOneWrapper = document.getElementById('step-one-wrapper');
          const stepTwoWrapper = document.getElementById('step-two-wrapper');
          const isMobile = window.innerWidth <= 650;
          goToSectionStep2(stepOneWrapper, stepTwoWrapper);
        }
      });

    })();
  `;
}
