import { Typography } from "@mochi-ui/core";
import { X, Discord } from "@mochi-ui/icons";

export const Footer = () => {
  return (
    <div className="px-4 py-6 border-t border-divider">
      <div className="flex items-center justify-between w-full max-w-6xl mx-auto">
        <Typography level="p6" className="text-text-tertiary">
          Copyright © 2024 Tono, All rights reserved.
        </Typography>
        <div className="flex items-center space-x-4">
          <Typography level="p6" className="text-text-tertiary">
            Docs
          </Typography>
          <Typography level="p6" className="text-text-tertiary">
            GitHub
          </Typography>
          <Typography level="p6" className="text-text-tertiary">
            Support
          </Typography>
          <div className="flex items-center space-x-2">
            <Discord className="w-4 h-4 text-text-tertiary" />
            <X className="w-4 h-4 text-text-tertiary" />
          </div>
        </div>
      </div>
    </div>
  );
};
