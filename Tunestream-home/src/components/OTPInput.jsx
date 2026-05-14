import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const OTPInput = ({ value, onChange, length = 6 }) => {
  const inputs = useRef([]);

  const handleChange = (e, index) => {
    const val = e.target.value;
    if (isNaN(val)) return;

    const newValue = value.split('');
    newValue[index] = val.slice(-1); // Only take last character
    const combined = newValue.join('');
    onChange(combined);

    // Focus next input
    if (val && index < length - 1) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length }).map((_, i) => (
        <motion.input
          key={i}
          ref={(el) => (inputs.current[i] = el)}
          type="text"
          maxLength="1"
          value={value[i] || ''}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="w-12 h-14 bg-white/5 border border-white/10 rounded-xl text-center text-white text-2xl font-bold focus:border-emerald-500 focus:bg-emerald-500/10 outline-none transition-all shadow-lg"
        />
      ))}
    </div>
  );
};

export default OTPInput;
