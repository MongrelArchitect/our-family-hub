import ErrorInterface from "@/types/Errors";

export default function generateError(
  rawError: unknown,
  functionName: string,
  customMessage: string,
  userId: number,
): ErrorInterface {
  const error: ErrorInterface = {
    error: "",
    functionName,
    message: customMessage,
    stack: "",
    timestamp: Date.now(),
    type: "ofh-custom",
    userId,
  };
  if (rawError instanceof Error) {
    error.error = rawError.message;
    error.stack = rawError.stack;
  } else {
    error.error = String(rawError);
    error.stack = undefined;
  }
  return error;
}
