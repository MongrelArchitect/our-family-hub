export default interface ErrorInterface {
  error: string;
  functionName: string;
  message: string;
  stack: string | undefined;
  timestamp: number;
  type: "ofh-custom";
  userId: number;
}
