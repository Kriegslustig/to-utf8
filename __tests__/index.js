const toUtf8 = require('../')

describe('toUtf8', () => {
  it('should return a typed array', () => {
    const result = toUtf8('abc')
    expect(result).toBeInstanceOf(Uint8Array)
  })

  it('should turn a string of characters in the ASCII char set into ASCII', () => {
    const input = 'abc'
    const result = toUtf8(input)
    expect(result.length).toBe(3)
    expect(result[0]).toBe(Number('0b01100001'))
    expect(result[1]).toBe(Number('0b01100010'))
    expect(result[2]).toBe(Number('0b01100011'))
  })

  it('should turn characters outside of the ASCII set into UTF-8', () => {
    [
      [
        'ä',
        ['11000011', '10100100'],
      ],
      [
        'Ř',
        ['11000101', '10011000'],
      ],
      [
        'ǃ',
        ['11000111', '10000011'],
      ],
      [
        'ಥ',
        ['11100000', '10110010', '10100101'],
      ],
    ].forEach(([ input, expected ]) => {
      const result = toUtf8(input)
      expected.forEach((bits, i) => {
        expect(result[i]).toBe(Number(`0b${bits}`))
      })
    })
  })

  it('should trun surrogate pairs into UTF-8', () => {
    const input = '🇨🇭'
    const result = toUtf8(input)

    // REGIONAL INDICATOR SYMBOL LETTER C
    expect(result[0]).toBe(Number('0b11110000'))
    expect(result[1]).toBe(Number('0b10011111'))
    expect(result[2]).toBe(Number('0b10000111'))
    expect(result[3]).toBe(Number('0b10101000'))

    // REGIONAL INDICATOR SYMBOL LETTER H
    expect(result[4]).toBe(Number('0b11110000'))
    expect(result[5]).toBe(Number('0b10011111'))
    expect(result[6]).toBe(Number('0b10000111'))
    expect(result[7]).toBe(Number('0b10101101'))
  })
})

describe('getUtf8CodePointAt', () => {
  it('should get the unicode code point of a simple character', () => {
    const [ codePoint, isSurrogate ] = toUtf8.getUtf8CodePointAt('a', 0)
    expect(codePoint).toBe(97)
    expect(isSurrogate).toBe(false)
  })

  it('should detect surrogate pairs', () => {
    const [ codePoint, isSurrogate ] = toUtf8.getUtf8CodePointAt('𐀂', 0)
    expect(isSurrogate).toBe(true)
  })

  it('should convert surrogate pairs', () => {
    const [ codePoint, isSurrogate ] = toUtf8.getUtf8CodePointAt('𐀀', 0)
    expect(codePoint).toBe(0x010000)
  })
})

