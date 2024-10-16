// index.ts

// Importing functions from settings.ts
export { getPopupSettings, getTopbarSettings } from "./settings";

// Importing function from generate-section-script-content.ts
export { generateSectionScriptContent } from "./generate-section-script-content";

// Importing function from generate-popup-script-content.ts
export { generatePopupScriptContent } from "./generate-popup-script-content";

// Importing functions from generate-topbar-script-content.ts
export { generateTopbarScriptContent } from "./generate-topbar-script-content";

// Helper function to be injected into both template literals
export function createSendFormDataFunction() {
  return `
    function sendFormData(url, formData, htmlContentStepTwo, stepTwoWrapper, spinner, onSuccess) {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', url, true);
      xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          if (response.success && response.generatedUrl) {

            // Truncate the URL if it's too long
            const truncatedUrl = response.generatedUrl.length > 15 
              ? response.generatedUrl.slice(0, 15) + '...' 
              : response.generatedUrl;

            // Update stepTwoWrapper's content dynamically
            stepTwoWrapper.innerHTML = htmlContentStepTwo;

            const urlDisplayDiv = stepTwoWrapper.querySelector('#domain');
            if (urlDisplayDiv) urlDisplayDiv.textContent = truncatedUrl;

            const copyButton = stepTwoWrapper.querySelector('#copy-button button');
            if (copyButton) {
              copyButton.addEventListener('click', () => {
                navigator.clipboard.writeText(response.generatedUrl)
                  .then(() => {
                    copyButton.textContent = 'Copied!';
                    setTimeout(() => copyButton.textContent = 'Copy', 3000);
                  })
                  .catch(err => console.error('Failed to copy URL:', err));
              });
            }

            // Social Media Sharing Links
            const socialMediaButtons = [
              { id: 'whatsapp', url: \`https://wa.me/?text=\${encodeURIComponent(response.generatedUrl)}\` },
              { id: 'email', url: \`mailto:?subject=Check this out&body=\${encodeURIComponent(response.generatedUrl)}\` },
              { id: 'facebook', url: \`https://www.facebook.com/sharer/sharer.php?u=\${encodeURIComponent(response.generatedUrl)}\` },
              { id: 'messenger', url: \`fb-messenger://share?link=\${encodeURIComponent(response.generatedUrl)}\` },
              { id: 'sms', url: \`sms:?&body=\${encodeURIComponent(response.generatedUrl)}\` },
              { id: 'x', url: \`https://twitter.com/intent/tweet?url=\${encodeURIComponent(response.generatedUrl)}\` },
              { id: 'reddit', url: \`https://www.reddit.com/submit?url=\${encodeURIComponent(response.generatedUrl)}\` },
              { id: 'linkedin', url: \`https://www.linkedin.com/shareArticle?mini=true&url=\${encodeURIComponent(response.generatedUrl)}\` }
            ];

            socialMediaButtons.forEach(button => {
              const element = document.getElementById(button.id);
              if (element) {
                element.addEventListener('click', () => window.open(button.url, '_blank'));
              }
            });

            // Hide spinner and show content
            spinner.style.display = 'none';
            stepTwoWrapper.style.display = 'block';

            // Transition to Step Two
            onSuccess();
          }
        }
      };
      xhr.send(JSON.stringify(formData));
    }
  `;
}

// Helper function to be injected into both template literals
export function createSpinnerFunction() {
  return `
    function createSpinner() {
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


      // Spinner CSS Styles
      const style = document.createElement('style');
      style.innerHTML = \`
        .spinner-container {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
          width: 100%;
          z-index: 10001; /* Ensure spinner is in front of other elements */
        }
        .spinner {
          border: 4px solid rgba(0, 0, 0, 0.1);
          border-top: 4px solid #47b775; /* Spinner color */
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
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

      return spinner;
    }
  `;
}
