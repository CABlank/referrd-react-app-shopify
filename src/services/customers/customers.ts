import fetch from "node-fetch";
import sgMail from "@sendgrid/mail";
import crypto from "crypto";

// Directus API Configuration
const DIRECTUS_API_URL = "https://api.referrd.com.au";
const DIRECTUS_ADMIN_TOKEN = process.env.TOKEN || ""; // Admin token for Directus
const SHOPIFY_APP_URL = process.env.SHOPIFY_APP_URL;

// SendGrid API Configuration
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || ""; // SendGrid API key
const SENDER_EMAIL = "dev@referrd.com.au"; // The email address you're sending from
const TOKEN_EXPIRY_TIME = 60 * 60 * 24 * 1000; // 24 hours in milliseconds

// Ensure required environment variables are present
if (!SENDGRID_API_KEY || !DIRECTUS_ADMIN_TOKEN) {
  throw new Error(
    "Missing required environment variables: SENDGRID_API_KEY or DIRECTUS_ADMIN_TOKEN."
  );
}

sgMail.setApiKey(SENDGRID_API_KEY);

// Function to send an email using the provided HTML template and registration link
async function sendRegistrationEmail({
  name,
  email,
  registrationLink,
}: {
  name: string;
  email: string;
  registrationLink: string;
}) {
  // Constructing the HTML email template
  const emailTemplate = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html data-editor-version="2" class="sg-campaigns" xmlns="http://www.w3.org/1999/xhtml">
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1">
      <!--[if !mso]><!-->
      <meta http-equiv="X-UA-Compatible" content="IE=Edge">
      <!--<![endif]-->
      <!--[if (gte mso 9)|(IE)]>
      <xml>
        <o:OfficeDocumentSettings>
          <o:AllowPNG/>
          <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
      </xml>
      <![endif]-->
      <!--[if (gte mso 9)|(IE)]>
  <style type="text/css">
    body {width: 600px;margin: 0 auto;}
    table {border-collapse: collapse;}
    table, td {mso-table-lspace: 0pt;mso-table-rspace: 0pt;}
    img {-ms-interpolation-mode: bicubic;}
  </style>
<![endif]-->
      <style type="text/css">
    body, p, div {
      font-family: inherit;
      font-size: 14px;
    }
    body {
      color: #000000;
    }
    body a {
      color: #843adc;
      text-decoration: none;
    }
    p { margin: 0; padding: 0; }
    table.wrapper {
      width:100% !important;
      table-layout: fixed;
      -webkit-font-smoothing: antialiased;
      -webkit-text-size-adjust: 100%;
      -moz-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    img.max-width {
      max-width: 100% !important;
    }
    .column.of-2 {
      width: 50%;
    }
    .column.of-3 {
      width: 33.333%;
    }
    .column.of-4 {
      width: 25%;
    }
    ul ul ul ul  {
      list-style-type: disc !important;
    }
    ol ol {
      list-style-type: lower-roman !important;
    }
    ol ol ol {
      list-style-type: lower-latin !important;
    }
    ol ol ol ol {
      list-style-type: decimal !important;
    }
    @media screen and (max-width:480px) {
      .preheader .rightColumnContent,
      .footer .rightColumnContent {
        text-align: left !important;
      }
      .preheader .rightColumnContent div,
      .preheader .rightColumnContent span,
      .footer .rightColumnContent div,
      .footer .rightColumnContent span {
        text-align: left !important;
      }
      .preheader .rightColumnContent,
      .preheader .leftColumnContent {
        font-size: 80% !important;
        padding: 5px 0;
      }
      table.wrapper-mobile {
        width: 100% !important;
        table-layout: fixed;
      }
      img.max-width {
        height: auto !important;
        max-width: 100% !important;
      }
      a.bulletproof-button {
        display: block !important;
        width: auto !important;
        font-size: 80%;
        padding-left: 0 !important;
        padding-right: 0 !important;
      }
      .columns {
        width: 100% !important;
      }
      .column {
        display: block !important;
        width: 100% !important;
        padding-left: 0 !important;
        padding-right: 0 !important;
        margin-left: 0 !important;
        margin-right: 0 !important;
      }
      .social-icon-column {
        display: inline-block !important;
      }
    }
  </style>
      <!--user entered Head Start--><link href="https://fonts.googleapis.com/css?family=Montserrat:500&display=swap" rel="stylesheet"><style>
body {font-family: 'Montserrat', sans-serif;}
</style><!--End Head user entered-->
    </head>
    <body>
      <center class="wrapper" data-link-color="#843adc" data-body-style="font-size:14px; font-family:inherit; color:#000000; background-color:#FFFFFF;">
        <div class="webkit">
          <table cellpadding="0" cellspacing="0" border="0" width="100%" class="wrapper" bgcolor="#FFFFFF">
            <tr>
              <td valign="top" bgcolor="#FFFFFF" width="100%">
                <table width="100%" role="content-container" class="outer" align="center" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td width="100%">
                      <table width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td>
                            <!--[if mso]>
    <center>
    <table><tr><td width="600">
  <![endif]-->
                                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%; max-width:600px;" align="center">
                                      <tr>
                                        <td role="modules-container" style="padding:0px 0px 0px 0px; color:#000000; text-align:left;" bgcolor="#f6f6f6" width="100%" align="left"><table class="module preheader preheader-hide" role="module" data-type="preheader" border="0" cellpadding="0" cellspacing="0" width="100%" style="display: none !important; mso-hide: all; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0;">
    <tr>
      <td role="module-content">
        <p></p>
      </td>
    </tr>
  </table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="9a42fcbe-df55-4250-a46c-1f0ce2366551" data-mc-module-version="2019-10-22">
    <tbody>
      <tr>
        <td style="padding:5px 5px 5px 5px; line-height:22px; text-align:inherit; background-color:#FFFFFF;" height="100%" valign="top" bgcolor="#FFFFFF" role="module-content"><div><div style="font-family: inherit; text-align: right"><span style="font-size: 12px">Email not displaying correctly? </span><a href="{{Weblink}}"><span style="font-size: 12px; color: #975ffa">View it in your browser</span></a><span style="font-size: 12px">.</span></div><div></div></div></td>
      </tr>
    </tbody>
  </table><table border="0" cellpadding="0" cellspacing="0" align="center" width="100%" role="module" data-type="columns" style="padding:30px 20px 30px 20px;" bgcolor="" data-distribution="1">
    <tbody>
      <tr role="module-content">
        <td height="100%" valign="top"><table width="560" style="width:560px; border-spacing:0; border-collapse:collapse; margin:0px 0px 0px 0px;" cellpadding="0" cellspacing="0" align="left" border="0" bgcolor="" class="column column-0">
      <tbody>
        <tr>
          <td style="padding:0px;margin:0px;border-spacing:0;"><table class="wrapper" role="module" data-type="image" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="3cc404fd-83f0-42d6-80bf-b09dd9d0494d">
    <tbody>
      <tr>
        <td style="font-size:6px; line-height:10px; padding:0px 0px 0px 0px;" valign="top" align="center">
          <img class="max-width" border="0" style="display:block; color:#000000; text-decoration:none; font-family:Helvetica, arial, sans-serif; font-size:16px;" width="162" alt="" data-proportionally-constrained="true" data-responsive="false" src="http://cdn.mcauto-images-production.sendgrid.net/79dcfd508a379b4f/bd7cd090-eeb4-4574-b6d4-f12a153bd00f/162x58.png" height="58">
        </td>
      </tr>
    </tbody>
  </table><table class="wrapper" role="module" data-type="image" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="3cc404fd-83f0-42d6-80bf-b09dd9d0494d.1">
    <tbody>
      <tr>
        <td style="font-size:6px; line-height:10px; padding:0px 0px 0px 0px;" valign="top" align="center">
          <img class="max-width" border="0" style="display:block; color:#000000; text-decoration:none; font-family:Helvetica, arial, sans-serif; font-size:16px; max-width:100% !important; width:100%; height:auto !important;" width="NaN" alt="" data-proportionally-constrained="true" data-responsive="true" src="http://cdn.mcauto-images-production.sendgrid.net/79dcfd508a379b4f/212f12e8-7b95-417c-9bd5-053749946654/500x150.png">
        </td>
      </tr>
    </tbody>
  </table></td>
        </tr>
      </tbody>
    </table></td>
      </tr>
    </tbody>
  </table><table border="0" cellpadding="0" cellspacing="0" align="center" width="100%" role="module" data-type="columns" style="padding:0px 30px 0px 30px;" bgcolor="" data-distribution="1">
    <tbody>
      <tr role="module-content">
        <td height="100%" valign="top"><table width="540" style="width:540px; border-spacing:0; border-collapse:collapse; margin:0px 0px 0px 0px;" cellpadding="0" cellspacing="0" align="left" border="0" bgcolor="" class="column column-0">
      <tbody>
        <tr>
          <td style="padding:0px;margin:0px;border-spacing:0;"><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="6d03a36c-f346-44d8-abaa-1207de9efaa8" data-mc-module-version="2019-10-22">
    <tbody>
      <tr>
        <td style="padding:50px 30px 18px 30px; line-height:28px; text-align:inherit; background-color:#ffffff;" height="100%" valign="top" bgcolor="#ffffff" role="module-content"><div><div style="font-family: inherit; text-align: center"><span style="color: #843adc; font-size: 28px">Welcome to referrd!</span></div><div></div></div></td>
      </tr>
    </tbody>
  </table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="6d03a36c-f346-44d8-abaa-1207de9efaa8.2" data-mc-module-version="2019-10-22">
    <tbody>
      <tr>
        <td style="padding:0px 30px 18px 30px; line-height:28px; text-align:inherit; background-color:#ffffff;" height="100%" valign="top" bgcolor="#ffffff" role="module-content"><div><div style="font-family: inherit; text-align: center">Thank you for signing up! You're just one step away from completing your registration.</div>
<div style="font-family: inherit; text-align: inherit"><br></div>
<div style="font-family: inherit; text-align: center">Please confirm your email address to activate your account and start using our services.</div><div></div></div></td>
      </tr>
    </tbody>
  </table><table border="0" cellpadding="0" cellspacing="0" class="module" data-role="module-button" data-type="button" role="module" style="table-layout:fixed;" width="100%" data-muid="f74e8f4d-cbd9-46da-a10f-cb01f5fa80ae">
      <tbody>
        <tr>
          <td align="center" bgcolor="#ffffff" class="outer-td" style="padding:0px 0px 0px 0px; background-color:#ffffff;">
            <table border="0" cellpadding="0" cellspacing="0" class="wrapper-mobile" style="text-align:center;">
              <tbody>
                <tr>
                <td align="center" bgcolor="#000000" class="inner-td" style="border-radius:6px; font-size:16px; text-align:center; background-color:inherit;">
                    <a href="${registrationLink}" style="background-color:#000000; border:1px solid #000000; border-radius:0px; color:#ffffff; font-size:14px; padding:12px 40px; text-align:center; text-decoration:none;">Activate Account</a>                </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table><table class="module" role="module" data-type="spacer" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="1196d5b7-c1e3-4837-a5d1-9f3e470df202">
    <tbody>
      <tr>
        <td style="padding:0px 0px 50px 0px;" role="module-content" bgcolor="#ffffff">
        </td>
      </tr>
    </tbody>
  </table></td>
        </tr>
      </tbody>
    </table></td>
      </tr>
    </tbody>
  </table><table border="0" cellpadding="0" cellspacing="0" align="center" width="100%" role="module" data-type="columns" style="padding:0px 30px 0px 30px;" bgcolor="" data-distribution="1,1,1">
    <tbody>
      <tr role="module-content">
        <td height="100%" valign="top"><table width="180" style="width:180px; border-spacing:0; border-collapse:collapse; margin:0px 0px 0px 0px;" cellpadding="0" cellspacing="0" align="left" border="0" bgcolor="" class="column column-0">
      <tbody>
        <tr>
          <td style="padding:0px;margin:0px;border-spacing:0;"><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="82ee418d-1efd-4b23-934f-f1a7fce8361c" data-mc-module-version="2019-10-22">
    <tbody>
      <tr>
        <td style="padding:18px 0px 18px 0px; line-height:22px; text-align:inherit;" height="100%" valign="top" bgcolor="" role="module-content"><div><div style="font-family: inherit; text-align: center"><a href="http://h"><u><strong>FACEBOOK</strong></u></a></div><div></div></div></td>
      </tr>
    </tbody>
  </table></td>
        </tr>
      </tbody>
    </table><table width="180" style="width:180px; border-spacing:0; border-collapse:collapse; margin:0px 0px 0px 0px;" cellpadding="0" cellspacing="0" align="left" border="0" bgcolor="" class="column column-1">
      <tbody>
        <tr>
          <td style="padding:0px;margin:0px;border-spacing:0;"><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="82ee418d-1efd-4b23-934f-f1a7fce8361c.1" data-mc-module-version="2019-10-22">
    <tbody>
      <tr>
        <td style="padding:18px 0px 18px 0px; line-height:22px; text-align:inherit;" height="100%" valign="top" bgcolor="" role="module-content"><div><div style="font-family: inherit; text-align: center"><span style="color: #843adc"><u><strong>INSTAGRAM</strong></u></span></div><div></div></div></td>
      </tr>
    </tbody>
  </table></td>
        </tr>
      </tbody>
    </table><table width="180" style="width:180px; border-spacing:0; border-collapse:collapse; margin:0px 0px 0px 0px;" cellpadding="0" cellspacing="0" align="left" border="0" bgcolor="" class="column column-2">
      <tbody>
        <tr>
          <td style="padding:0px;margin:0px;border-spacing:0;"><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="82ee418d-1efd-4b23-934f-f1a7fce8361c.1.1.1" data-mc-module-version="2019-10-22">
    <tbody>
      <tr>
        <td style="padding:18px 0px 18px 0px; line-height:22px; text-align:inherit;" height="100%" valign="top" bgcolor="" role="module-content"><div><div style="font-family: inherit; text-align: center"><span style="color: #843adc"><u><strong>LINKEDIN</strong></u></span></div><div></div></div></td>
      </tr>
    </tbody>
  </table></td>
        </tr>
      </tbody>
    </table></td>
      </tr>
    </tbody>
  </table><div data-role="module-unsubscribe" class="module" role="module" data-type="unsubscribe" style="color:#444444; font-size:12px; line-height:20px; padding:16px 16px 16px 16px; text-align:Center;" data-muid="4e838cf3-9892-4a6d-94d6-170e474d21e5"><div class="Unsubscribe--addressLine"></div><p style="font-size:12px; line-height:20px;"><a target="_blank" class="Unsubscribe--unsubscribeLink zzzzzzz" href="{{{unsubscribe}}}" style="">Unsubscribe</a> - <a href="{{{unsubscribe_preferences}}}" target="_blank" class="Unsubscribe--unsubscribePreferences" style="">Unsubscribe Preferences</a></p></div><table border="0" cellpadding="0" cellspacing="0" class="module" data-role="module-button" data-type="button" role="module" style="table-layout:fixed;" width="100%" data-muid="0621addb-821f-4988-b25f-30838f0382bf">
      <tbody>
        <tr>
          <td align="center" bgcolor="" class="outer-td" style="padding:0px 0px 20px 0px;">
            <table border="0" cellpadding="0" cellspacing="0" class="wrapper-mobile" style="text-align:center;">
              <tbody>
                <tr>
                <td align="center" bgcolor="#f5f8fd" class="inner-td" style="border-radius:6px; font-size:16px; text-align:center; background-color:inherit;"><a href="https://sendgrid.com/" style="background-color:#f5f8fd; border:1px solid #f5f8fd; border-color:#f5f8fd; border-radius:25px; border-width:1px; color:#a8b9d5; display:inline-block; font-size:10px; font-weight:normal; letter-spacing:0px; line-height:normal; padding:5px 18px 5px 18px; text-align:center; text-decoration:none; border-style:solid; font-family:helvetica,sans-serif;" target="_blank">♥ POWERED BY TWILIO SENDGRID</a></td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table></td>
                                      </tr>
                                    </table>
                                    <!--[if mso]>
                                  </td>
                                </tr>
                              </table>
                            </center>
                            <![endif]-->
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </div>
      </center>
    </body>
  </html>
  `;

  // Prepare the email message
  const msg = {
    to: email,
    from: SENDER_EMAIL,
    subject: "Complete Your Registration with Referrd",
    html: emailTemplate, // Use the constructed HTML email template
  };

  try {
    // Send the email using SendGrid
    await sgMail.send(msg);
  } catch (error) {
    console.error("Error sending email via SendGrid:", error);
    if ((error as any).response) {
      console.error((error as any).response.body);
    }
    throw error;
  }
}

// Function to find an existing user by email in Directus
async function findDirectusCustomerByEmail(email: string) {
  const response = await fetch(
    `${DIRECTUS_API_URL}/users?filter[email][_eq]=${email}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${DIRECTUS_ADMIN_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to search for user in Directus: ${response.statusText}`
    );
  }

  const data: Array<any> = (await response.json()) as Array<any>;
  return data.length > 0 ? data[0] : null;
}

// Function to create or return existing customer in Directus
export async function createDirectusCustomer({
  name,
  email,
  updatedData,
}: {
  name: string;
  email: string;
  updatedData: Record<string, any>;
}) {
  try {
    // Check if the customer already exists in Directus
    const existingUser = await findDirectusCustomerByEmail(email);

    if (existingUser) {
      // Return null to indicate user already exists
      return null;
    }



    const response = await fetch(`${DIRECTUS_API_URL}/users`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${DIRECTUS_ADMIN_TOKEN}`, // Admin token for authentication
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        first_name: name,
        email,
        role: "0e774687-8d5f-4a8e-9268-e94d86b42a63", // Customer role UUID
        status: "invited", // Marks the user as invited, triggering an email to set their password
      }),
    });

    if (!response.ok) {
      const responseBody = await response.text();

      // Handle RECORD_NOT_UNIQUE error and return null instead
      if (responseBody.includes('"code":"RECORD_NOT_UNIQUE"')) {

        return null; // User already exists
      }

      // If some other error occurred, throw an error
      throw new Error(
        `Failed to create customer in Directus: ${response.statusText} ${responseBody}`
      );
    }

    const createdUser: any = await response.json();

    // Extract the user ID from the response
    const userId = createdUser.data?.id;

    if (!userId) {
      throw new Error("Failed to retrieve user ID from Directus response");
    }



    // Generate a secure token for registration
    const registrationToken = crypto.randomBytes(32).toString("hex");

    // Set token expiration time (e.g., 24 hours from now)
    const tokenExpiryDate = new Date(
      Date.now() + TOKEN_EXPIRY_TIME
    ).toISOString();

    // Update the new user's data with additional information (uuid and token)
    const patchResponse = await fetch(`${DIRECTUS_API_URL}/users/${userId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${DIRECTUS_ADMIN_TOKEN}`, // Admin token for authentication
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...updatedData, // Include existing updated data
        registration_token: registrationToken, // Add registration token
        token_expiry: tokenExpiryDate, // Add token expiry
      }),
    });

    if (!patchResponse.ok) {
      const patchErrorText = await patchResponse.text();
      throw new Error(
        `Failed to update user with UUID and token: ${patchErrorText}`
      );
    }


    // Send registration email with the secure token in the registration link
    const registrationLink = `${SHOPIFY_APP_URL}/register?token=${registrationToken}`;
    await sendRegistrationEmail({ name, email, registrationLink });

    return createdUser;
  } catch (error) {
    console.error("Error in createDirectusCustomer:", error);
    throw error;
  }
}
