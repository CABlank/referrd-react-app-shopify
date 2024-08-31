export function generateSectionScriptContent(campaignData: any, settings: any) {
  return `
    (function() {
      console.log("Script Loaded: Initializing Section Campaign...");

      const campaignData = ${JSON.stringify(campaignData)};
      const settings = ${JSON.stringify(settings)};
      const compiledHtml = campaignData.compiledHtml ? JSON.parse(campaignData.compiledHtml) : {};

      const createSectionElement = () => {
        console.log("Creating Section Element...");

        const sectionElement = document.createElement('div');
        sectionElement.id = 'campaign-section';
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

        // Try to find the footer element
        const footerElement = document.querySelector('footer, .footer, #footer, [class*="footer"], [id*="footer"]');
        if (footerElement) {
          footerElement.parentNode.insertBefore(sectionElement, footerElement);
          console.log('Section inserted before the footer.');
        } else {
          console.warn('Footer element not found. Appending section to the body.');
          document.body.appendChild(sectionElement);
        }

        applySectionSettings(1, isMobile);

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
            xhr.open('POST', ' https://bfc7b8e384a4.ngrok.app/api/campaign-content/submit-form', true);
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
                  goToSectionStep2(stepOneWrapper, stepTwoWrapper);
                }
              }
            };
            xhr.send(JSON.stringify(formData));
          });
        }
      };

      const applySectionSettings = (step, isMobile) => {
        console.log(\`Applying Section settings for step \${step}...\`);
        let settingsStep;

        settingsStep = isMobile ? (step === 1 ? settings.mobileStep1 : settings.mobileStep2) : (step === 1 ? settings.desktopStep1 : settings.desktopStep2);
        console.log('Section Settings:', settingsStep);

        const sectionElement = document.getElementById('campaign-section');
        if (sectionElement && settingsStep) {
          sectionElement.style.backgroundColor = settingsStep.backgroundColor;
          sectionElement.style.width = settingsStep.width;
          sectionElement.style.height = settingsStep.height;
          sectionElement.style.borderRadius = (parseInt(settingsStep.borderWidth) + 2) + 'px';
        }
      };

      const goToSectionStep2 = (stepOneWrapper, stepTwoWrapper) => {
        console.log("Transitioning to Section Step Two...");

        stepOneWrapper.style.display = "none";
        stepTwoWrapper.style.display = "block";

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
