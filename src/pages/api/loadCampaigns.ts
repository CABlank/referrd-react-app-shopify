import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const BOT_TOKEN = process.env.BOT_TOKEN;

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  try {
    console.log("Fetching draft and active campaigns from API...");

    const response = await fetch(`${API_URL}/items/campaign_public_page`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${BOT_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch campaigns");
    }

    const { data: campaigns } = await response.json();

    const mostRecentCampaign = campaigns.find(
      (campaign: any) => campaign.id === 11
    );

    if (!mostRecentCampaign) {
      res.setHeader("Content-Type", "application/javascript");
      return res
        .status(404)
        .send("console.error('Campaign with ID 11 not found');");
    }

    const iframeURL = `app.referrd.com.au/campaign/${mostRecentCampaign.id}`;

    const settingsPopup = mostRecentCampaign.settingsPopupState
      ? JSON.parse(mostRecentCampaign.settingsPopupState)
      : null;
    const settingsTopbar = mostRecentCampaign.settingsTopbarState
      ? JSON.parse(mostRecentCampaign.settingsTopbarState)
      : null;

    const desktopStep1Popup = settingsPopup?.desktopStep1;
    const desktopStep2Popup = settingsPopup?.desktopStep2;
    const mobileStep1Popup = settingsPopup?.mobileStep1;
    const mobileStep2Popup = settingsPopup?.mobileStep2;

    const desktopStep1Topbar = settingsTopbar?.desktopStep1;
    const desktopStep2Topbar = settingsTopbar?.desktopStep2;
    const mobileStep1Topbar = settingsTopbar?.mobileStep1;
    const mobileStep2Topbar = settingsTopbar?.mobileStep2;

    let scriptContent = `
      (function() {
        const iframe = document.createElement('iframe');
        iframe.src = '${iframeURL}';
        iframe.style.border = 'none';
        iframe.style.display = 'none';
        iframe.style.opacity = '0';
        iframe.style.transition = 'opacity 0.3s ease';

        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
        overlay.style.zIndex = '9998';
        document.body.appendChild(overlay);

        const closeButton = document.createElement('button');
        closeButton.innerHTML = '&times;';
        closeButton.style.position = 'fixed';
        closeButton.style.zIndex = '10000';
        closeButton.style.backgroundColor = 'transparent';
        closeButton.style.border = 'none';
        closeButton.style.fontSize = '24px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.display = 'none';
        closeButton.onclick = function() {
          document.body.removeChild(iframe);
          document.body.removeChild(overlay);
          document.body.removeChild(closeButton);
          document.body.style.marginTop = '0';
        };
        document.body.appendChild(closeButton);

        iframe.onload = function() {
          window.addEventListener('message', function(event) {
            const allowedOrigins = [
              'app.referrd.com.au',
              'https://overboard-development.myshopify.com'
            ];

            if (!allowedOrigins.includes(event.origin)) {
              console.log('Ignoring message from unknown origin:', event.origin);
              return;
            }

            if (event.data === 'componentLoaded') {
              iframe.style.display = 'block';
              setTimeout(() => {
                iframe.style.opacity = '1';
              }, 50);

              if (format === 'Topbar') {
                document.body.style.marginTop = iframe.style.height;
                if (currentStep === 2) {
                  closeButton.style.display = 'block';
                  closeButton.style.top = '0';
                  closeButton.style.right = '0';
                }
              } else if (format === 'Popup') {
                closeButton.style.display = 'block';
              }
            }
          });

          iframe.contentWindow.postMessage('checkComponentLoaded', '*');
        };

        function applySettings(step, format) {
          const isMobile = window.innerWidth <= ${desktopStep1Popup?.width.replace("px", "")};
          let settings;

          if (format === 'Popup') {
            settings = isMobile ? (step === 1 ? ${JSON.stringify(mobileStep1Popup)} : ${JSON.stringify(mobileStep2Popup)}) : (step === 1 ? ${JSON.stringify(desktopStep1Popup)} : ${JSON.stringify(desktopStep2Popup)});
          } else if (format === 'Topbar') {
            settings = isMobile ? (step === 1 ? ${JSON.stringify(mobileStep1Topbar)} : ${JSON.stringify(mobileStep2Topbar)}) : (step === 1 ? ${JSON.stringify(desktopStep1Topbar)} : ${JSON.stringify(desktopStep2Topbar)});
          }

          if (format === 'Popup') {
            iframe.style.position = 'fixed';
            iframe.style.top = '50%';
            iframe.style.left = '50%';
            iframe.style.transform = 'translate(-50%, -50%)';
            iframe.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
            iframe.style.zIndex = '9999';
            iframe.style.borderRadius = (parseInt(settings.borderWidth) + 2) + 'px';
            iframe.style.height = settings.height;
            iframe.style.width = settings.width;
            closeButton.style.top = 'calc(53% - ' + settings.height + '/2 - 20px)';
            if (isMobile) {
              closeButton.style.right = 'calc(55% - ' + settings.width + '/2 - 20px)';
            } else {
              closeButton.style.right = 'calc(52% - ' + settings.width + '/2 - 20px)';
            }
          } else if (format === 'Topbar') {
            iframe.style.position = 'fixed';
            iframe.style.top = '0';
            iframe.style.left = '0';
            iframe.style.zIndex = '9999';
            iframe.style.height = settings.height;
            iframe.style.width = '100%';

            if (currentStep === 2) {
              closeButton.style.display = 'block';
              closeButton.style.top = '0';
              closeButton.style.right = '0';
            } else {
              closeButton.style.display = 'none';
            }
          }
        }

        function printIframeContent() {
          const iframeWindow = iframe.contentWindow;
          const printStyles = document.createElement('style');
          printStyles.type = 'text/css';
          printStyles.media = 'print';
          printStyles.innerHTML = \`
            @media print {
              body {
                margin: 0;
                padding: 0;
                font-size: 12pt;
              }
              img {
                max-width: 100%;
                height: auto;
              }
            }
          \`;

          iframeWindow.document.head.appendChild(printStyles);
          iframeWindow.focus();
          iframeWindow.print();
        }

        let currentStep = 1;
        const format = '${mostRecentCampaign.format}';
        applySettings(currentStep, format);

        window.addEventListener('resize', function() {
          applySettings(currentStep, format);
        });

        window.addEventListener('message', function(event) {
          const allowedOrigins = [
            'app.referrd.com.au',
            'https://overboard-development.myshopify.com'
          ];

          if (!allowedOrigins.includes(event.origin)) {
            return;
          }

          if (event.data === 'goToStep2') {
            currentStep = 2;
            applySettings(currentStep, format);
            if (format === 'Topbar') {
              document.body.style.marginTop = iframe.style.height;
              closeButton.style.display = 'block';
              closeButton.style.top = '0';
              closeButton.style.right = '0';
            } else if (format === 'Popup') {
              const newSettings = isMobile ? ${JSON.stringify(mobileStep2Popup)} : ${JSON.stringify(desktopStep2Popup)};
              iframe.style.height = newSettings.height;
              iframe.style.width = newSettings.width;
              closeButton.style.top = 'calc(53% - ' + newSettings.height + '/2 - 20px)';
              if (isMobile) {
                closeButton.style.right = 'calc(55% - ' + newSettings.width + '/2 - 20px)';
              } else {
                closeButton.style.right = 'calc(52% - ' + newSettings.width + '/2 - 20px)';
              }
            }
          } else if (event.data === 'print') {
            printIframeContent();
          }
        });

        document.body.appendChild(iframe);
      })();
    `;

    res.setHeader("Content-Type", "application/javascript");
    res.status(200).send(scriptContent);
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    res.setHeader("Content-Type", "application/javascript");
    res.status(500).send("console.error('Internal Server Error');");
  }
}
