import { it, describe } from 'node:test'
import assert from 'node:assert/strict'
import { getDayDifferenceCeil, ONE_DAY_MS, ONE_HOUR_MS } from './util'

describe('getDurationDelta', () => {
  it('should return ceiled amount days between', () => {
    const result = getDayDifferenceCeil(0, 1)
    assert.deepEqual(result, 1)
  })

  it('should not matter, the order that is', () => {
    const resultA = getDayDifferenceCeil(ONE_DAY_MS * 2, 0)
    const resultB = getDayDifferenceCeil(0, ONE_DAY_MS * 2)
    assert.deepEqual(resultA, resultB)
  })

  it('should return zero for identical timestamps', () => {
    const result = getDayDifferenceCeil(ONE_HOUR_MS, ONE_HOUR_MS)
    assert.deepEqual(result, 0)
  })

  it('should handle the scenario when the difference spans multiple days', () => {
    const result = getDayDifferenceCeil(ONE_DAY_MS * 10, ONE_DAY_MS * 20)
    assert.deepEqual(result, 10)
  })
})
