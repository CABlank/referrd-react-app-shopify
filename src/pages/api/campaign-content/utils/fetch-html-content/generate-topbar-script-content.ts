import { createSendFormDataFunction, createSpinnerFunction } from "./index";


export function generateTopbarScriptContent(
  campaignData: any,
  settings: any,
  referralUuidFromUrl?: string | null
) {
  const sendFormDataFunction = createSendFormDataFunction();
  const spinnerFunction = createSpinnerFunction();
  const referralUuid = referralUuidFromUrl;
  const SHOPIFY_APP_URL = process.env.CONFIG_SHOPIFY_APP_URL as string;

  return `
    (function() {
      ${sendFormDataFunction}
      ${spinnerFunction}


      console.log("Script Loaded: Initializing Topbar Campaign...");

      const campaignData = ${JSON.stringify(campaignData)};

            console.log("campaignData",campaignData);

      const settings = ${JSON.stringify(settings)};
      const compiledHtmlTopBar = campaignData.compiledHtmlTopBar ? JSON.parse(campaignData.compiledHtmlTopBar) : {};

      const createTopbarElement = () => {
        console.log("Creating Topbar Element...");

        const topbarElement = document.createElement('div');
        topbarElement.id = 'campaign';
        topbarElement.style.position = 'fixed';
        topbarElement.style.top = '0';
        topbarElement.style.left = '0';
        topbarElement.style.width = '100%';
        topbarElement.style.height = settings.desktopStep1.height;
        topbarElement.style.backgroundColor = settings.desktopStep1.backgroundColor;
        topbarElement.style.zIndex = '9999';
        topbarElement.style.display = 'flex'; // Use flexbox to center spinner
        topbarElement.style.justifyContent = 'center'; // Center horizontally
        topbarElement.style.alignItems = 'center'; // Center vertically

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
          topbarElement.style.display = 'none';
          document.body.style.marginTop = '0';
        });

        topbarElement.appendChild(closeButton);
        document.body.appendChild(topbarElement);

        document.body.style.marginTop = settings.desktopStep1.height;

        const isMobile = window.innerWidth <= 650;
        const htmlContentStepOne = isMobile ? compiledHtmlTopBar.mobileStepOne : compiledHtmlTopBar.desktopStepOne;
        const htmlContentStepTwo = isMobile ? compiledHtmlTopBar.mobileStepTwo : compiledHtmlTopBar.desktopStepTwo;

        const stepOneWrapper = document.createElement('div');
        stepOneWrapper.id = 'step-one-wrapper';
        stepOneWrapper.innerHTML = htmlContentStepOne;
        stepOneWrapper.style.display = 'block';
        topbarElement.appendChild(stepOneWrapper);

        const stepTwoWrapper = document.createElement('div');
        stepTwoWrapper.id = 'step-two-wrapper';
        stepTwoWrapper.innerHTML = '';  // Initially keep it empty to avoid showing placeholders
        stepTwoWrapper.style.display = 'none';
        topbarElement.appendChild(stepTwoWrapper);

        // Create and append the spinner
        const spinner = createSpinner();
        console.log("Spinner created:", spinner);

        if (!spinner) {
          console.error("Spinner creation failed!");
        } else {
          topbarElement.appendChild(spinner); // Append the spinner directly to the topbar element
          console.log("Spinner appended to topbarElement:", topbarElement);
        }

        applyTopbarSettings(1, isMobile);
        setupTopbarEventListeners(stepOneWrapper, stepTwoWrapper, spinner);

        // Initialize formData object
        const formData = {};

        // Add event listeners to input elements
        const inputContainers = stepOneWrapper.querySelectorAll('.input-container');
        const inputs = stepOneWrapper.querySelectorAll('input[name]');
        let expandedId = null;

        inputs.forEach(input => {
          const inputName = input.name;

          input.addEventListener('input', () => {
            console.log(\`\${inputName} typing: \`, input.value);
            formData[inputName] = input.value;
            console.log('Current formData:', formData);
          });
        });

        if (isMobile) {
          inputContainers.forEach((container, index) => {
            const input = container.querySelector('input');
            const iconContainer = container.querySelector('.icon-container');
            const identifier = input ? input.placeholder : \`Input container \${index + 1}\`;

            if (input) {
              container.addEventListener('click', () => {
                if (expandedId !== index) {
                  if (expandedId !== null) {
                    const previousContainer = inputContainers[expandedId];
                    const previousInput = previousContainer.querySelector('input');
                    const previousIconContainer = previousContainer.querySelector('.icon-container');

                    if (previousInput && previousContainer && previousIconContainer) {
                      previousInput.style.display = 'none';
                      previousContainer.style.width = '38px';
                      previousContainer.style.border = '1px solid';
                      previousContainer.style.padding = '10px';
                      previousIconContainer.style.display = 'block';
                    }
                  }

                  if (input && container && iconContainer) {
                    input.style.display = 'block';
                    container.style.width = '120px';
                    container.style.border = 'none';
                    container.style.padding = '0';
                    iconContainer.style.display = 'none';
                  }
                  expandedId = index;

                  console.log(\`\${identifier} clicked\`);
                }
              });
            }
          });
        }

        const submitButton = stepOneWrapper.querySelector('#submit-button');
        submitButton.addEventListener('click', (event) => {
          event.preventDefault();

          // Extract URL parameters and referral UUID if it exists
          const urlParams = new URLSearchParams(window.location.search);
          const firstKey = urlParams.keys().next().value;

          let referralUuid = null;
          if (firstKey) {
            referralUuid = firstKey.split('?')[0]; // Only split if firstKey exists
          }

          formData.referred_by = referralUuid || null;

          // Add metadata
          formData.metadata = JSON.stringify({
            origin: window.location.origin,
            referrer: ${referralUuid ? `'${referralUuid}'` : "document.referrer"},
            timestamp: new Date().toISOString(),
          });

          formData.campaign_uuid = campaignData.campaign_uuid;
          formData.company_id = campaignData.company_id;

          console.log('Form submitted with data:', formData);

          // Hide step one and show spinner immediately
          stepOneWrapper.style.display = 'none';
          spinner.style.display = 'flex'; // Make sure the spinner is displayed and centered
          console.log("Spinner displayed");

          sendFormData(
            '${SHOPIFY_APP_URL}/api/campaign-content/submit-form',
            formData,
            htmlContentStepTwo,
            stepTwoWrapper,
            spinner,
            () => {
              goToTopbarStep2(stepOneWrapper, stepTwoWrapper);  // Correct function call
            }
          );

        });

      };

      const applyTopbarSettings = (step, isMobile) => {
        console.log(\`Applying Topbar settings for step \${step}...\`);
        let settingsStep;

        settingsStep = isMobile ? (step === 1 ? settings.mobileStep1 : settings.mobileStep2) : (step === 1 ? settings.desktopStep1 : settings.desktopStep2);
        console.log('Topbar Settings:', settingsStep);

        const topbarElement = document.getElementById('campaign');
        if (topbarElement && settingsStep) {
          topbarElement.style.backgroundColor = settingsStep.backgroundColor;
          topbarElement.style.height = settingsStep.height;
          document.body.style.marginTop = settingsStep.height;
        }
      };

      const setupTopbarEventListeners = (stepOneWrapper, stepTwoWrapper, spinner) => {
        console.log("Setting up Topbar event listeners...");

        const submitButton = stepOneWrapper.querySelector("#submit-button");
        console.log("Topbar Submit button:", submitButton);
        if (submitButton) {
          submitButton.addEventListener("click", (event) => {
            console.log("Topbar Submit button clicked");
            event.preventDefault();

            // Hide step one and show spinner
            stepOneWrapper.style.display = "none";
            spinner.style.display = "flex";
            console.log("Spinner displayed");

            goToTopbarStep2(stepOneWrapper, stepTwoWrapper);
          });
        }
      };

      const goToTopbarStep2 = (stepOneWrapper, stepTwoWrapper) => {
        console.log("Transitioning to Topbar Step Two...");

        stepOneWrapper.style.display = "none";
        stepTwoWrapper.style.display = "block";

        const spinner = document.getElementById("spinner");
        if (spinner) spinner.style.display = 'none';

        const isMobile = window.innerWidth <= 650;
        applyTopbarSettings(2, isMobile);
      };

      // Initialize the Topbar
      createTopbarElement();

      // Handle window resize events
      window.addEventListener('resize', function() {
        const currentStep = document.querySelector("#step-two-wrapper")?.style.display === "block" ? 2 : 1;
        const isMobile = window.innerWidth <= 650;
        applyTopbarSettings(currentStep, isMobile);
      });

      // Handle postMessage events for Topbar
      window.addEventListener('message', function(event) {
        console.log("Topbar Received message:", event.data);
        if (event.data === 'goToStep2') {
          const stepOneWrapper = document.getElementById('step-one-wrapper');
          const stepTwoWrapper = document.getElementById('step-two-wrapper');
          const isMobile = window.innerWidth <= 650;
          goToTopbarStep2(stepOneWrapper, stepTwoWrapper);
        }
      });

    })();
  `;
}
