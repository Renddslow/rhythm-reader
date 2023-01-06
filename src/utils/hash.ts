const hash = (e) => {
  let t = 0;
  for (let r = 0; r < e.length; r++) t = (t << 5) - t + e.charCodeAt(r);
  return Math.abs(t & ~(0 << 31)).toString(16);
};

export default hash;
