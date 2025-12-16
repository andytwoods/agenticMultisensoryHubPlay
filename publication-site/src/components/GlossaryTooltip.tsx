import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GlossaryTooltipProps {
    term: string;
    definition: string;
}

export const GlossaryTooltip = ({ term, definition }: GlossaryTooltipProps) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <span
            className="relative inline-block group cursor-help"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
            onClick={(e) => {
                e.stopPropagation(); // Prevent closing the card when clicking the term
                setIsVisible(!isVisible);
            }}
        >
            <span className="border-b-2 border-fuchsia-500/50 group-hover:border-fuchsia-500 transition-colors text-white font-semibold">
                {term}
            </span>

            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 0, y: 5, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 5, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 rounded-xl bg-gray-900/95 backdrop-blur-md border border-fuchsia-500/30 shadow-[0_0_20px_rgba(255,0,255,0.2)] z-50 pointer-events-none"
                    >
                        <div className="text-xs font-bold text-fuchsia-400 mb-1 uppercase tracking-wider">Definition</div>
                        <div className="text-sm text-gray-200 leading-snug">{definition}</div>
                        {/* Arrow */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900/95"></div>
                    </motion.div>
                )}
            </AnimatePresence>
        </span>
    );
};
