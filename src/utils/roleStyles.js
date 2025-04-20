export const getBackgroundColorForRole = (role) => {
  switch (role) {
    case "admin":
      return "#c0c0c0"; // Darker gray
    case "agent":
      return "#b6e6b6"; // Darker green
    case "customer":
      return "#b6cbe6"; // Darker blue
    default:
      return "#ffffff"; // Fallback white
  }
};