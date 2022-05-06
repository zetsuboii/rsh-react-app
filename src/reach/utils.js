// Cleans string from \u0000 empty bytes
const clean = s => s.replace(/\0/g, '').replace(/\\u0000/g, '');

export {
    clean
}