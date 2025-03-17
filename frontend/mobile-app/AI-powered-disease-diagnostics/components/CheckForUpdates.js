import * as Updates from "expo-updates";

const checkForUpdates = async () => {
  try {
    console.log("checking.....")
    const update = await Updates.checkForUpdateAsync();
    if (update.isAvailable) {
      await Updates.fetchUpdateAsync();
      await Updates.reloadAsync(); // Restart app to apply update
    }
  } catch (error) {
    console.log("Error checking for updates:", error);
  }
};


export default checkForUpdates