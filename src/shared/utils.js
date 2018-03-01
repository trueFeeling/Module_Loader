/**
 * 
 * @param {Object} obj 
 * @param {String} pro 
 */
export default function hasOwn(obj, pro) {
    return ({}).hasOwnProperty.call(obj, pro);
}