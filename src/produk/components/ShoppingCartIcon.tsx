import React, { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";

interface ShoppingCartIconProps {
  itemCount: number;
}

const badgeVariants: Variants = {
  initial: { scale: 0, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: {
      damping: 10,
      stiffness: 100,
    },
  },
  exit: {
    scale: 0,
    opacity: 0,
    transition: {
      duration: 0.1,
    },
  },
};

const ShoppingCartIcon: React.FC<ShoppingCartIconProps> = ({ itemCount }) => {
  const [animateBadge, setAnimateBadge] = useState(false);
  const [previousItemCount, setPreviousItemCount] = useState(itemCount);

  React.useEffect(() => {
    if (itemCount > previousItemCount) {
      setAnimateBadge(true);
      setTimeout(() => setAnimateBadge(false), 300);
    }
    setPreviousItemCount(itemCount);
  }, [itemCount, previousItemCount]);

  return (
    <div className="relative inline-block">
      <ShoppingCart size={28} className="text-gray-800" />
      {itemCount > 0 && (
        <motion.span
          key={itemCount}
          className="absolute top-[-8px] right-[-8px] bg-orange-500 text-white text-xs font-semibold rounded-full px-2 py-0.5"
          initial="initial"
          animate={animateBadge ? "animate" : "animate"}
          exit="exit"
          variants={badgeVariants}
        >
          {itemCount}
        </motion.span>
      )}
    </div>
  );
};

export default ShoppingCartIcon;
