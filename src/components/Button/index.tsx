import { Text, Pressable } from 'react-native';
import { cn } from '~/utils';

export default function Button({ children, onPress, className }: { children: React.ReactNode, onPress: () => void, className?: string }) {
  return (
    <Pressable
      className={cn("bg-primary-500 rounded-lg px-4 py-5 active:bg-primary-600", className)}
      onPress={onPress}
    >
      <Text className="text-white text-base font-semibold text-center">
        {children}
      </Text>
    </Pressable>
  );
}
