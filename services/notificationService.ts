import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const requestNotificationPermissions = async (): Promise<boolean> => {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('new-posts', {
      name: 'New Posts',
      importance: Notifications.AndroidImportance.DEFAULT,
      showBadge: true,
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  if (existingStatus === 'granted') {
    return true;
  }

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
};

export const notifyNewPost = async (authorName: string, title: string) => {
  const currentBadge = (await Notifications.getBadgeCountAsync()) || 0;
  await Notifications.setBadgeCountAsync(currentBadge + 1);

  await Notifications.scheduleNotificationAsync({
    content: {
      title: `New announcement from ${authorName}`,
      body: title,
      badge: currentBadge + 1,
    },
    trigger: null,
  });
};

export const clearBadge = async () => {
  await Notifications.setBadgeCountAsync(0);
};
