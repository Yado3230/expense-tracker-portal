/**
 * Deep link handler to redirect users to mobile app or fallback to app store
 * (Android only version)
 */
export const openAppLink = (path: string = "") => {
  // Check if the user is on a mobile device
  const isMobile = /Android/i.test(navigator.userAgent);

  if (!isMobile) {
    // Handle desktop case if needed
    return;
  }

  // Your app's package name (replace with your actual package name)
  const packageName = "com.example.expense_tracker_mobile";

  // Your website domain that matches what's in your Android manifest
  const domain = "expense-tracker-portal.vercel.app";

  // App store link for fallback
  const androidAppStoreLink = `https://play.google.com/store/apps/details?id=${packageName}`;

  // The specific path to open in the app
  const deepLinkPath = path ? path : "";

  // For Android, try intent URL with your domain (App Links approach)
  const intentUrl = `intent://${domain}${
    deepLinkPath.startsWith("/") ? deepLinkPath : "/" + deepLinkPath
  }#Intent;scheme=https;package=${packageName};end`;
  window.location.href = intentUrl;

  // Fallback to Play Store after a short timeout
  setTimeout(() => {
    window.location.href = androidAppStoreLink;
  }, 2500);
};
