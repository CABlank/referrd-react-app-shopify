export const logAndReturnError = (message: string, error?: unknown) => {
  console.error(message, error);
  return { props: { serverError: true } };
};
