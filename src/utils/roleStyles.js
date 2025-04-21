export const getBackgroundColorForRole = (role) => {
  switch (role) {
    case "admin":
      return "#c0c0c0"; // Darker gray
      case "agent":
        return "#d2b48c"; // Light brown (25% darker than the green)
    case "customer":
      return "#b6cbe6"; // Darker blue
    default:
      return "#ffffff"; // Fallback white
  }
};