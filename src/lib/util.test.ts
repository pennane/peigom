import { it, describe } from 'node:test'
import assert from 'node:assert/strict'
import { ceiledDayDifference, ONE_DAY_MS, ONE_HOUR_MS } from './util'

describe('lib/util.ts', () => {
  describe('ceiledDayDifference', () => {
    it('should return the rounded-up (ceiled) number of days between two timestamps', () => {
      const result = ceiledDayDifference(0, 1)
      assert.deepEqual(result, 1)
    })

    it('should return the same result regardless of the input order', () => {
      const resultA = ceiledDayDifference(ONE_DAY_MS * 2, 0)
      const resultB = ceiledDayDifference(0, ONE_DAY_MS * 2)
      assert.deepEqual(resultA, resultB)
    })

    it('should return zero for identical timestamps', () => {
      const result = ceiledDayDifference(ONE_HOUR_MS, ONE_HOUR_MS)
      assert.deepEqual(result, 0)
    })

    it('should calculate the number of days accurately across multiple days', () => {
      const result = ceiledDayDifference(ONE_DAY_MS * 10, ONE_DAY_MS * 20)
      assert.deepEqual(result, 10)
    })
  })
})
