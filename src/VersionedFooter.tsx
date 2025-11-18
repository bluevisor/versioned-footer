"use client";

import React, { useState, useEffect } from "react";
import versionData from "../version.json";

export interface VersionedFooterProps {
  companyName?: string;
  startYear?: number;
  className?: string;
  showVersion?: boolean;
}

export default function VersionedFooter({
  companyName = "Your Company",
  startYear = new Date().getFullYear(),
  className = "",
  showVersion = true,
}: VersionedFooterProps) {
  const [currentYear, setCurrentYear] = useState(startYear);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  const yearRange = startYear === currentYear ? currentYear : `${startYear} - ${currentYear}`;

  return (
    <footer className={`text-center ${className}`}>
      <p className="text-sm text-gray-500 dark:text-white/30 transition-colors duration-300">
        &copy; {yearRange} | {companyName}. All rights reserved.
        {showVersion && ` v${versionData.version}`}
      </p>
    </footer>
  );
}
