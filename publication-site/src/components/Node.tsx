import React from 'react'; // Implied import for JSX
import { motion, MotionValue } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface NodeProps {
    id: string;
    label: string;
    x: number | MotionValue<number>;
    y: number | MotionValue<number>;
    isActive: boolean;
    onClick: () => void;
    category: string;
}

const categoryColors: Record<string, string> = {
    'context': 'bg-fuchsia-500 shadow-fuchsia-500/50',
    'sensory': 'bg-cyan-500 shadow-cyan-500/50',
    'body': 'bg-lime-500 shadow-lime-500/50',
    'social': 'bg-orange-500 shadow-orange-500/50',
};

export const Node = ({ label, x, y, isActive, onClick, category }: NodeProps) => {
    const colorClass = categoryColors[category] || 'bg-white shadow-white/50';

    return (
        <motion.div
            className="absolute cursor-pointer flex flex-col items-center justify-center p-4 group"
            style={{
                left: '50%',
                top: '50%',
                x,
                y,
                translateX: '-50%',
                translateY: '-50%',
            }}
            onClick={onClick}
            whileHover={{ scale: 1.1, zIndex: 10 }}
            animate={{
                scale: isActive ? 1.2 : 1,
                opacity: isActive ? 1 : 0.8,
            }}
        >
            <motion.div
                className={twMerge(
                    "w-6 h-6 rounded-full shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-all duration-300",
                    colorClass,
                    isActive ? "w-12 h-12 shadow-[0_0_40px_currentColor]" : "group-hover:w-8 group-hover:h-8"
                )}
                layoutId={`node-circle-${label}`}
            />

            <motion.span
                className={twMerge(
                    "mt-3 text-sm font-bold tracking-widest uppercase text-white/70 bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm transition-colors",
                    isActive ? "text-white bg-black/80" : "group-hover:text-white"
                )}
            >
                {label}
            </motion.span>
        </motion.div>
    );
};
