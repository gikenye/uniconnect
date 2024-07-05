import { TouchableOpacity } from "react-native";
import * as Haptics from "expo-haptics";

export function HapticButton({ children, style, weight, onClick }) {
  return (
    <TouchableOpacity
      style={style}
      onPress={(e) => {
        weight == "heavy"
          ? Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
          : weight == "medium"
          ? Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
          : Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        if (onClick) onClick(e);
      }}
    >
      {children}
    </TouchableOpacity>
  );
}