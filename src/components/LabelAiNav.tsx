import { motion } from 'framer-motion';
import { LabelAiNavProps } from '@/types/label';

const LabelAiNav = ({ content }: LabelAiNavProps) => {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute -bottom-14 left-1/2 -translate-x-1/2 bg-grayLight text-center p-2 px-4 rounded-lg ">
            <div className="label-bulle">
                <p className="text-text whitespace-nowrap text-sm font-semibold">{content}</p>
            </div>
        </motion.div>
    )
}

export default LabelAiNav;