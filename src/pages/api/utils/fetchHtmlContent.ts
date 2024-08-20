// fetchHtmlContent.ts

// Extract settings specifically for the Popup format
export function getPopupSettings(campaignData: any) {
  return campaignData.settingsPopupState
    ? JSON.parse(campaignData.settingsPopupState)
    : null;
}

// Extract settings specifically for the Topbar format
export function getTopbarSettings(campaignData: any) {
  return campaignData.settingsTopbarState
    ? JSON.parse(campaignData.settingsTopbarState)
    : null;
}

// Generate script content for Popup format
export function generatePopupScriptContent(campaignData: any, settings: any) {
  return `
    (function() {
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

        // Add spinner while loading
        const spinner = document.createElement('div');
        spinner.id = 'spinner';
        spinner.innerHTML = \`
          <div class="spinner-container">
            <div class="spinner">
              <div class="spinner-text">R</div>
            </div>
          </div>
        \`;
        spinner.style.display = 'none'; // Hidden initially
        stepTwoWrapper.appendChild(spinner);

        // Spinner CSS Styles
        const style = document.createElement('style');
        style.innerHTML = \`
          .spinner-container {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100%;
            width: 100%;
          }
          .spinner {
            border: 4px solid rgba(0, 0, 0, 0.1);
            border-top: 4px solid #47b775; /* Spinner color */
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            position: relative;
          }
          .spinner-text {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 16px;
            font-weight: bold;
            color: #47b775; /* Text color */
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        \`;
        document.head.appendChild(style);

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
              referrer: document.referrer,
              timestamp: new Date().toISOString(),
            });

            // Add campaign-specific data to formData
            formData.campaign_uuid = campaignData.campaign_uuid;
            formData.company_id = campaignData.company_id;

            console.log('Form submitted with data:', formData);

            const xhr = new XMLHttpRequest();
            xhr.open('POST', 'https://0fe0-2a0c-5a81-506-d900-10c5-f3f3-cedc-84fe.ngrok-free.app/api/submit-form', true);
            xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
            xhr.onreadystatechange = function() {
              if (xhr.readyState === 4 && xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                if (response.success && response.generatedUrl) {
                  console.log('Generated URL:', response.generatedUrl);

                  const maxUrlLength = 15;
                  const truncatedUrl = response.generatedUrl.length > maxUrlLength
                    ? response.generatedUrl.slice(0, maxUrlLength) + '...'
                    : response.generatedUrl;

                  // Update stepTwoWrapper's content dynamically
                  stepTwoWrapper.innerHTML = htmlContentStepTwo;  // Insert the actual HTML once we have the correct URL

                  const urlDisplayDiv = stepTwoWrapper.querySelector('#domain');
                  if (urlDisplayDiv) {
                    urlDisplayDiv.textContent = truncatedUrl;
                  }

                  const copyButton = stepTwoWrapper.querySelector('#copy-button button');
                  if (copyButton) {
                    copyButton.addEventListener('click', () => {
                      navigator.clipboard.writeText(response.generatedUrl).then(() => {
                        copyButton.textContent = 'Copied!';
                        setTimeout(() => {
                          copyButton.textContent = 'Copy';
                        }, 3000);
                      }).catch(err => {
                        console.error('Failed to copy URL: ', err);
                      });
                    });
                  }

                  // Social Media Sharing
                  document.getElementById('whatsapp').addEventListener('click', () => {
                    const shareUrl = \`https://wa.me/?text=\${encodeURIComponent(response.generatedUrl)}\`;
                    window.open(shareUrl, '_blank');
                  });

                  document.getElementById('email').addEventListener('click', () => {
                    const shareUrl = \`mailto:?subject=Check this out&body=\${encodeURIComponent(response.generatedUrl)}\`;
                    window.open(shareUrl, '_blank');
                  });

                  document.getElementById('facebook').addEventListener('click', () => {
                    const shareUrl = \`https://www.facebook.com/sharer/sharer.php?u=\${encodeURIComponent(response.generatedUrl)}\`;
                    window.open(shareUrl, '_blank');
                  });

                  document.getElementById('messenger').addEventListener('click', () => {
                    const shareUrl = \`fb-messenger://share?link=\${encodeURIComponent(response.generatedUrl)}\`;
                    window.open(shareUrl, '_blank');
                  });

                  document.getElementById('sms').addEventListener('click', () => {
                    const shareUrl = \`sms:?&body=\${encodeURIComponent(response.generatedUrl)}\`;
                    window.open(shareUrl, '_blank');
                  });

                  document.getElementById('x').addEventListener('click', () => {
                    const shareUrl = \`https://twitter.com/intent/tweet?url=\${encodeURIComponent(response.generatedUrl)}\`;
                    window.open(shareUrl, '_blank');
                  });

                  document.getElementById('reddit').addEventListener('click', () => {
                    const shareUrl = \`https://www.reddit.com/submit?url=\${encodeURIComponent(response.generatedUrl)}\`;
                    window.open(shareUrl, '_blank');
                  });

                  document.getElementById('linkedin').addEventListener('click', () => {
                    const shareUrl = \`https://www.linkedin.com/shareArticle?mini=true&url=\${encodeURIComponent(response.generatedUrl)}\`;
                    window.open(shareUrl, '_blank');
                  });

                  // Hide spinner and show content
                  spinner.style.display = 'none';  // Hide spinner after loading is complete
                  stepTwoWrapper.style.display = 'block';  // Display the actual content

                  // Transition to Step Two
                  goToPopupStep2(stepOneWrapper, stepTwoWrapper);
                }
              }
            };
            xhr.send(JSON.stringify(formData));
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

export function generateTopbarScriptContent(campaignData: any, settings: any) {
  return `
    (function() {
      console.log("Script Loaded: Initializing Topbar Campaign...");

      const campaignData = ${JSON.stringify(campaignData)};
      const settings = ${JSON.stringify(settings)};
      const compiledHtml = campaignData.compiledHtml ? JSON.parse(campaignData.compiledHtml) : {};

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
        const htmlContentStepOne = isMobile ? compiledHtml.mobileStepOne : compiledHtml.desktopStepOne;
        const htmlContentStepTwo = isMobile ? compiledHtml.mobileStepTwo : compiledHtml.desktopStepTwo;

        const stepOneWrapper = document.createElement('div');
        stepOneWrapper.id = 'step-one-wrapper';
        stepOneWrapper.innerHTML = htmlContentStepOne;
        stepOneWrapper.style.display = 'block';
        topbarElement.appendChild(stepOneWrapper);

        const stepTwoWrapper = document.createElement('div');
        stepTwoWrapper.id = 'step-two-wrapper';
        stepTwoWrapper.innerHTML = '';  // Initially keep it empty to avoid showing placeholders
        stepTwoWrapper.style.display = 'none';
        stepTwoWrapper.style.position = 'relative';
        topbarElement.appendChild(stepTwoWrapper);

        // Add spinner while loading
        const spinner = document.createElement('div');
        spinner.id = 'spinner';
        spinner.innerHTML = \`
          <div class="spinner-container">
            <div class="spinner">
              <div class="spinner-text">R</div>
            </div>
          </div>
        \`;
        spinner.style.display = 'block';  // Show spinner initially
        stepTwoWrapper.appendChild(spinner);

        // Spinner CSS Styles
        const style = document.createElement('style');
        style.innerHTML = \`
          .spinner-container {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100%;
            width: 100%;
          }
          .spinner {
            border: 4px solid rgba(0, 0, 0, 0.1);
            border-top: 4px solid #47b775; /* Spinner color */
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            position: relative;
          }
          .spinner-text {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 16px;
            font-weight: bold;
            color: #47b775; /* Text color */
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        \`;
        document.head.appendChild(style);

        applyTopbarSettings(1, isMobile);
        setupTopbarEventListeners(stepOneWrapper, stepTwoWrapper);

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
            referrer: document.referrer,
            timestamp: new Date().toISOString(),
          });

          formData.campaign_uuid = campaignData.campaign_uuid;
          formData.company_id = campaignData.company_id;

          console.log('Form submitted with data:', formData);

          const xhr = new XMLHttpRequest();
          xhr.open('POST', 'https://0fe0-2a0c-5a81-506-d900-10c5-f3f3-cedc-84fe.ngrok-free.app/api/submit-form', true);
          xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
          xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
              const response = JSON.parse(xhr.responseText);
              if (response.success && response.generatedUrl) {
                console.log('Generated URL:', response.generatedUrl);

                const maxUrlLength = 15;
                const truncatedUrl = response.generatedUrl.length > maxUrlLength
                  ? response.generatedUrl.slice(0, maxUrlLength) + '...'
                  : response.generatedUrl;

                // Update stepTwoWrapper's content dynamically
                stepTwoWrapper.innerHTML = htmlContentStepTwo;  // Insert the actual HTML once we have the correct URL

                const urlDisplayDiv = stepTwoWrapper.querySelector('#domain');
                if (urlDisplayDiv) {
                  urlDisplayDiv.textContent = truncatedUrl;
                }

                const copyButton = stepTwoWrapper.querySelector('#copy-button button');
                if (copyButton) {
                  copyButton.addEventListener('click', () => {
                    navigator.clipboard.writeText(response.generatedUrl).then(() => {
                      copyButton.textContent = 'Copied!';
                      setTimeout(() => {
                        copyButton.textContent = 'Copy';
                      }, 3000);
                    }).catch(err => {
                      console.error('Failed to copy URL: ', err);
                    });
                  });
                }

                // Social Media Sharing
                document.getElementById('whatsapp').addEventListener('click', () => {
                  const shareUrl = \`https://wa.me/?text=\${encodeURIComponent(response.generatedUrl)}\`;
                  window.open(shareUrl, '_blank');
                });

                document.getElementById('email').addEventListener('click', () => {
                  const shareUrl = \`mailto:?subject=Check this out&body=\${encodeURIComponent(response.generatedUrl)}\`;
                  window.open(shareUrl, '_blank');
                });

                document.getElementById('facebook').addEventListener('click', () => {
                  const shareUrl = \`https://www.facebook.com/sharer/sharer.php?u=\${encodeURIComponent(response.generatedUrl)}\`;
                  window.open(shareUrl, '_blank');
                });

                document.getElementById('messenger').addEventListener('click', () => {
                  const shareUrl = \`fb-messenger://share?link=\${encodeURIComponent(response.generatedUrl)}\`;
                  window.open(shareUrl, '_blank');
                });

                document.getElementById('sms').addEventListener('click', () => {
                  const shareUrl = \`sms:?&body=\${encodeURIComponent(response.generatedUrl)}\`;
                  window.open(shareUrl, '_blank');
                });

                document.getElementById('x').addEventListener('click', () => {
                  const shareUrl = \`https://twitter.com/intent/tweet?url=\${encodeURIComponent(response.generatedUrl)}\`;
                  window.open(shareUrl, '_blank');
                });

                document.getElementById('reddit').addEventListener('click', () => {
                  const shareUrl = \`https://www.reddit.com/submit?url=\${encodeURIComponent(response.generatedUrl)}\`;
                  window.open(shareUrl, '_blank');
                });

                document.getElementById('linkedin').addEventListener('click', () => {
                  const shareUrl = \`https://www.linkedin.com/shareArticle?mini=true&url=\${encodeURIComponent(response.generatedUrl)}\`;
                  window.open(shareUrl, '_blank');
                });

                // Hide spinner and show content
                spinner.style.display = 'none';  // Hide spinner after loading is complete
                stepTwoWrapper.style.display = 'block';  // Display the actual content

                // Now that the URL and content are ready, transition to Step Two
                goToTopbarStep2(stepOneWrapper, stepTwoWrapper);
              }
            }
          };
          xhr.send(JSON.stringify(formData));
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

      const setupTopbarEventListeners = (stepOneWrapper, stepTwoWrapper) => {
        console.log("Setting up Topbar event listeners...");

        const submitButton = stepOneWrapper.querySelector("#submit-button");
        console.log("Topbar Submit button:", submitButton);
        if (submitButton) {
          submitButton.addEventListener("click", (event) => {
            console.log("Topbar Submit button clicked");
            event.preventDefault();
            goToTopbarStep2(stepOneWrapper, stepTwoWrapper);
          });
        }
      };

      const goToTopbarStep2 = (stepOneWrapper, stepTwoWrapper) => {
        console.log("Transitioning to Topbar Step Two...");

        stepOneWrapper.style.display = "none";
        stepTwoWrapper.style.display = "block";

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
