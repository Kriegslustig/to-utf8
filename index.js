const toUtf8 = (str) => {
  const maxLength = str.length * 4
  const utf8Bytes = new Uint8Array(maxLength)
  let bytesIndex = 0
  for (let charIndex = 0; charIndex < str.length; ++charIndex) {
    const codePoint = str.charCodeAt(charIndex)
    const character = str[charIndex]
    console.log({ character, codePoint })
    if (codePoint <= 127) {
      utf8Bytes[bytesIndex++] = codePoint
    } else if (codePoint <= 2047) {
      utf8Bytes[bytesIndex++] = getTrailingByte(2, 0, codePoint)
      utf8Bytes[bytesIndex++] = getTrailingByte(2, 1, codePoint)
    } else if (codePoint <= 65535) {
      utf8Bytes[bytesIndex++] = getTrailingByte(3, 0, codePoint)
      utf8Bytes[bytesIndex++] = getTrailingByte(3, 1, codePoint)
      utf8Bytes[bytesIndex++] = getTrailingByte(3, 2, codePoint)
    } else {
      utf8Bytes[bytesIndex++] = getTrailingByte(4, 0, codePoint)
      utf8Bytes[bytesIndex++] = getTrailingByte(4, 1, codePoint)
      utf8Bytes[bytesIndex++] = getTrailingByte(4, 2, codePoint)
      utf8Bytes[bytesIndex++] = getTrailingByte(4, 3, codePoint)
    }
  }

  return utf8Bytes.subarray(0, bytesIndex)
}

const SIX_PLACES_MASK = Number('0b111111')

const getTrailingByte = (totalBytes, byteNumber, codePoint) =>
  codePoint
  >> ((totalBytes - 1 - byteNumber) * 6)
  & SIX_PLACES_MASK
  | (
    byteNumber === 0
      ? getInitialByteMask(totalBytes)
      : 128
  )

const getInitialByteMask = (totalBytes) => {
  let shift = totalBytes
  let result = 128
  while (--totalBytes > 0)
    result |= 128 >> totalBytes
  return result
}

module.exports = toUtf8
