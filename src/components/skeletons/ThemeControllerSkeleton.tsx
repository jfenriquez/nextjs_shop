"use client";
import { motion } from "framer-motion";
import React from "react";

const ThemeControllerSkeleton = () => {
  return (
    <motion.div
      className="h-6 w-16 rounded-full bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 animate-pulse"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 3 * 0.1 }}
    />
  );
};

export default ThemeControllerSkeleton;
