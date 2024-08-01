import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import jwt from "jsonwebtoken";

interface ParsedUrlQuery {
  [key: string]: string | string[] | undefined;
}

interface CustomContext extends GetServerSidePropsContext {
  query: ParsedUrlQuery & {
    shop?: string;
    id_token?: string;
    accessToken?: string | null;
    refreshToken?: string | null;
  };
}

interface JwtPayload {
  exp: number;
  [key: string]: any; // Include any additional properties
}

const decodeAndVerifyToken = (token: string): JwtPayload => {
  try {
    const decodedPayload = jwt.decode(token) as JwtPayload;
    const currentTime = Math.floor(Date.now() / 1000);
    if (!decodedPayload || currentTime > decodedPayload.exp) {
      throw new Error("Token has expired or is invalid");
    }
    return decodedPayload;
  } catch (error) {
    throw new Error("Token validation failed");
  }
};

const sessionLoadChecker = async (
  context: CustomContext
): Promise<GetServerSidePropsResult<{ [key: string]: any }>> => {
  try {
    const {
      shop,
      id_token: idToken,
      accessToken,
      refreshToken,
    } = context.query;

    if (!shop) {
      console.log("Missing shop parameter");
      return {
        props: {
          error: "missing_shop",
        },
      };
    }

    if (!idToken) {
      console.log("Missing id_token parameter");
      return {
        props: {
          error: "missing_id_token",
        },
      };
    }

    console.log("Shop:", shop);
    console.log("ID Token:", idToken);

    const decodedToken = decodeAndVerifyToken(idToken);
    console.log("Decoded Token:", decodedToken);

    // Log the received tokens
    console.log("Received accessToken:", accessToken);
    console.log("Received refreshToken:", refreshToken);

    // Set up the session using the accessToken and refreshToken
    if (accessToken && refreshToken) {
      console.log("Setting up session with accessToken and refreshToken");

      const reqWithSession = context.req as any; // Type assertion to bypass TypeScript error

      if (!reqWithSession.session) {
        reqWithSession.session = {}; // Ensure session object exists
      }

      reqWithSession.session.accessToken = accessToken;
      reqWithSession.session.refreshToken = refreshToken;
      console.log("Session setup completed:", reqWithSession.session);
    } else {
      console.warn(
        "Access token or refresh token missing, cannot set session."
      );
    }

    return {
      props: {
        data: "valid_request",
        accessToken: accessToken || null,
        refreshToken: refreshToken || null,
      },
    };
  } catch (error: unknown) {
    console.error("An error occurred:", (error as Error).message);
    return {
      props: {
        error: (error as Error).message,
      },
    };
  }
};

export default sessionLoadChecker;
