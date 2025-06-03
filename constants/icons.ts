import React from "react";
import { Home, Target, Car, Book, Gift, Circle } from "lucide-react";
import { COLORS } from "./colors";

export const ICON_COMPONENTS = {
  home: Home,
  target: Target,
  car: Car,
  book: Book,
  gift: Gift,
  circle: Circle,
} as const;

export type IconName = keyof typeof ICON_COMPONENTS;

// Icon configurations for different contexts
export const GOAL_ICONS = [
  { name: "home" as const, component: Home },
  { name: "target" as const, component: Target },
  { name: "car" as const, component: Car },
  { name: "book" as const, component: Book },
  { name: "gift" as const, component: Gift },
  { name: "circle" as const, component: Circle },
];

// Helper function to get icon JSX for goal manager
export const getGoalIcon = (iconName: IconName, size: number = 24): React.JSX.Element => {
  const IconComponent = ICON_COMPONENTS[iconName];
  return React.createElement(IconComponent, { size, color: COLORS.PRIMARY });
};