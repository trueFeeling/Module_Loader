/*
 * 参考 merge-descriptors
 */

/**
 * Module exports.
 * @public
 */

export default merge;

/**
 * Module variables.
 * @private
 */

let hasOp = ({}).hasOwnProperty;

/**
 * Merge the property descriptors of `src` into `dest`
 *
 * @param {object} dest Object to add descriptors to
 * @param {object} src Object to clone descriptors from
 * @param {boolean} [redefine=true] Redefine `dest` properties with `src` properties
 * @returns {object} Reference to dest
 * @public
 */

function merge(dest, src, redefine) {
  if (!dest) {
    throw new TypeError('argument dest is required')
  }

  if (!src) {
    throw new TypeError('argument src is required')
  }

  if (redefine === undefined) {
    // Default to true
    redefine = true
  }
  let descriptor;
  Object.getOwnPropertyNames(src).forEach(name => {
    if (!redefine && hasOp.call(dest, name)) {
      // Skip desriptor
      return
    }

    // Copy descriptor
    descriptor = Object.getOwnPropertyDescriptor(src, name)
    Object.defineProperty(dest, name, descriptor)
  });

  return dest
}