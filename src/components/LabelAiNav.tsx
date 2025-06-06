"use client";
import { motion } from 'framer-motion';
import { LabelAiNavProps } from '@/types/label';

const LabelAiNav = ({ content }: LabelAiNavProps) => {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center rounded-lg ">
            <p className="text-text whitespace-nowrap text-sm font-semibold">{content}</p>
        </motion.div>
    )
}

export default LabelAiNav;