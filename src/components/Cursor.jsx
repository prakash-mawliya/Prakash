import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const Cursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState("default");

  useEffect(() => {
    const mouseMove = (e) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
    };

    window.addEventListener("mousemove", mouseMove);

    return () => {
      window.removeEventListener("mousemove", mouseMove);
    };
  }, []);

  useEffect(() => {
    const handleMouseOver = (e) => {
      if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || e.target.closest('a') || e.target.closest('button')) {
        setCursorVariant("text");
      } else {
        setCursorVariant("default");
      }
    };

    // Use mouseover instead of mouseenter for event delegation
    document.addEventListener("mouseover", handleMouseOver);

    return () => {
      document.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  const variants = {
    default: {
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
      height: 32,
      width: 32,
      backgroundColor: "transparent",
      border: "2px solid var(--primary)",
      mixBlendMode: "difference"
    },
    text: {
      height: 64,
      width: 64,
      x: mousePosition.x - 32,
      y: mousePosition.y - 32,
      backgroundColor: "var(--primary)",
      border: "none",
      mixBlendMode: "difference",
      opacity: 0.5
    }
  };

  const dotVariants = {
    default: {
      x: mousePosition.x - 4,
      y: mousePosition.y - 4,
      height: 8,
      width: 8,
      backgroundColor: "var(--primary)"
    },
    text: {
      height: 0,
      width: 0,
      opacity: 0
    }
  };

  // Only render on desktop
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    setIsDesktop(window.matchMedia("(min-width: 768px)").matches);
  }, []);

  if (!isDesktop) return null;

  return (
    <>
      <motion.div
        className="cursor-dot"
        variants={dotVariants}
        animate={cursorVariant}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9999
        }}
      />
      <motion.div
        className="cursor-ring"
        variants={variants}
        animate={cursorVariant}
        transition={{ type: "spring", stiffness: 150, damping: 15 }} // Slower follow
        style={{
            position: 'fixed',
            top: 0,
            left: 0,
            borderRadius: '50%',
            pointerEvents: 'none',
            zIndex: 9998
        }}
      />
    </>
  );
};

export default Cursor;
