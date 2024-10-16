import { createSendFormDataFunction, createSpinnerFunction } from "./index";

export function generatePopupScriptContent(
  campaignData: any,
  settings: any,
  referralUuidFromUrl?: string | null,
  discountCode?: string | null
) {
  const sendFormDataFunction = createSendFormDataFunction();
  const spinnerFunction = createSpinnerFunction();
  const referralUuid = referralUuidFromUrl;
  const SHOPIFY_APP_URL = process.env.CONFIG_SHOPIFY_APP_URL as string;

  return `
    (function() {
      ${sendFormDataFunction}
      ${spinnerFunction}


      const campaignData = ${JSON.stringify(campaignData)};
      const settings = ${JSON.stringify(settings)};
      const compiledHtml = campaignData.compiledHtml ? JSON.parse(campaignData.compiledHtml) : {};

      const createPopupElement = () => {

          // Check localStorage for a flag to see if the popup has already been dismissed
    const popupDismissed = localStorage.getItem('popupDismissed');

    if (popupDismissed === 'true') {
        // If the popup was previously dismissed, do not show it again
        return;
    }

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
        popupElement.style.display = 'none';
        const overlay = document.getElementById('overlay');
        if (overlay) overlay.style.display = 'none';

        // Save in localStorage that the popup has been dismissed
        localStorage.setItem('popupDismissed', 'true');

        console.log('Popup dismissed');
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

if (${discountCode ? `'${discountCode}'` : null}) {
  const discountWrapper = document.createElement('div');
  discountWrapper.id = 'discount-code-wrapper';
  discountWrapper.style.padding = '8px';
  discountWrapper.style.backgroundColor = '#f9f9f9';
  discountWrapper.style.borderBottom = '1px solid #ddd';
  discountWrapper.style.display = 'flex';
  discountWrapper.style.justifyContent = 'space-between';
  discountWrapper.style.alignItems = 'center';
  discountWrapper.style.marginBottom = '10px';
  discountWrapper.style.fontFamily = 'Arial, sans-serif';
  discountWrapper.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
  discountWrapper.style.borderRadius = '8px';
  discountWrapper.style.padding = '10px 50px';

  discountWrapper.innerHTML = \`
    <span style="font-size: 16px; font-weight: 500; color: #333;">
      Your Discount Code:
    </span>
    <div style="display: inline-flex; align-items: center; background-color: #fff; padding: 5px 10px; border-radius: 5px; border: 1px solid #ddd;">
      <span id="discount-code-text" style="font-size: 16px; font-weight: bold; color: #007bff; margin-right: 10px;">
        ${discountCode}
      </span>
      <button id="copy-discount-button" style="padding: 5px 8px; background-color: #007bff; color: white; border: none; cursor: pointer; border-radius: 5px; font-size: 14px;">
        Copy
      </button>
    </div>
  \`;

  popupElement.insertBefore(discountWrapper, stepOneWrapper);

  // Handle copy to clipboard functionality
  const copyButton = discountWrapper.querySelector('#copy-discount-button');
  const discountText = discountWrapper.querySelector('#discount-code-text').innerText;

  copyButton.addEventListener('click', () => {
    navigator.clipboard.writeText(discountText).then(() => {
      copyButton.innerText = 'Copied!';
      copyButton.style.backgroundColor = '#28a745'; // Change button color to green after copying
      setTimeout(() => {
        copyButton.innerText = 'Copy'; // Reset button text after a delay
        copyButton.style.backgroundColor = '#007bff'; // Reset button color to original
      }, 2000);
    }).catch((err) => {
      console.error('Failed to copy discount code: ', err);
    });
  });
}



        // Create and append the spinner using the function defined earlier
        const spinner = createSpinner();
        popupElement.appendChild(spinner);

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
              referrer: ${referralUuid ? `'${referralUuid}'` : "document.referrer"},
              timestamp: new Date().toISOString(),
            });


            console.log('campaignData.allowDiscounts', campaignData)
            // Add campaign-specific data to formData
                 formData.campaign_uuid = campaignData.campaign_uuid;
          formData.company_id = campaignData.company_id;
          formData.allowDiscounts = campaignData.allowDiscounts;
          formData.appliesTo = campaignData.appliesTo;
          formData.discounType = campaignData.discounType;
          formData.discountValue = campaignData.discountValue;


            sendFormData('${SHOPIFY_APP_URL}/api/campaign-content/submit-form', formData, htmlContentStepTwo, stepTwoWrapper, spinner, () => {
              goToPopupStep2(stepOneWrapper, stepTwoWrapper);  // Correct function call
            });

          });
        }
      };

      const applyPopupSettings = (step, isMobile) => {
        let settingsStep;

        settingsStep = isMobile ? (step === 1 ? settings.mobileStep1 : settings.mobileStep2) : (step === 1 ? settings.desktopStep1 : settings.desktopStep2);

        const popupElement = document.getElementById('campaign');
        if (popupElement && settingsStep) {
          popupElement.style.backgroundColor = settingsStep.backgroundColor;
          popupElement.style.width = settingsStep.width;
          popupElement.style.height = settingsStep.height;
          popupElement.style.borderRadius = (parseInt(settingsStep.borderWidth) + 2) + 'px';
        }
      };

      const goToPopupStep2 = (stepOneWrapper, stepTwoWrapper) => {

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
