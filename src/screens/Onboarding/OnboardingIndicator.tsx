import { View } from 'react-native';

export default function OnboardingIndicator({ currentIndex = 0 }) {
  return (
    <View className="flex-row items-center justify-center space-x-2 mt-4">
      {[0, 1, 2].map((index) => (
        <View
          key={index}
          className={
            index === currentIndex
              ? 'w-6 h-2 rounded-full bg-primary-500 mx-1'
              : 'w-2 h-2 rounded-full bg-white border-primary-500 border mx-1'
          }
        />
      ))}
    </View>
  );
}
