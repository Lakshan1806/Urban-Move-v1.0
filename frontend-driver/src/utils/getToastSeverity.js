const severityMap = {
  201: "info",
  401: "warn",
  404: "warn",
};

function getToastSeverity(status) {
  if (!status) return "error";
  if (severityMap[status]) return severityMap[status];
  if (status >= 500) return "error";
  if (status >= 200 && status < 300) return "success";

  return "info";
}

export default getToastSeverity;
