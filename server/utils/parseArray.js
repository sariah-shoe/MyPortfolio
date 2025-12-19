// small helper at top of controller file
function parseArray(val) {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') {
    try { const arr = JSON.parse(val); return Array.isArray(arr) ? arr : []; } catch { }
  }
  return [];
}

export {parseArray}