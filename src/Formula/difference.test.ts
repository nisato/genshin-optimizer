import { finiteDifference } from "./difference"
import { frac, makeReaders, max, min, prod, res, sum, threshold_add, todo } from "./utils"

const cInner = { a: "unique", b: "unique", c: "unique" } as const
const context = { a: cInner, b: cInner, c: cInner } as const
const cReaders = makeReaders(context)

describe("finite difference", () => {
  test("simple", () => {
    const r1 = cReaders.a.a, r2 = cReaders.a.b, r3 = cReaders.a.c

    // d/dx sum(...) = sum ( d/dx ... )
    expect(finiteDifference([sum(r1, r2, r3, 8)], () => true))
      .toEqual([sum(r1, r2, r3)])
    // Split the terms for min/max
    expect(finiteDifference([min(r1, r2, r3, 8)], () => true))
      .toEqual([r1, r2, r3])
    expect(finiteDifference([max(r1, r2, r3, 8)], () => true))
      .toEqual([r1, r2, r3])

    // **CAUTION**
    // This assumes that every term in `prod` is non-negative
    expect(finiteDifference([prod(r1, r2, r3, 8)], () => true))
      .toEqual([r1, r2, r3])

    // **CAUTION**
    // This assumes that `frac.x >= max(-frac.c, 0)`
    expect(finiteDifference([frac(r1, r2)], () => true))
      .toEqual([r1, prod(r2, -1)])

    // **CAUTION**
    // This assumes that `threshold_add.addition` is non-negative
    expect(finiteDifference([threshold_add(r1, r2, r3)], () => true))
      .toEqual([r1, prod(r2, -1), r3])

    expect(finiteDifference([res(r1)], () => true))
      .toEqual([prod(r1, -1)])
  })
  test("no diff", () => {
    const r1 = cReaders.a.a, r2 = cReaders.a.b, r3 = cReaders.a.c
    const noDiff = cReaders.b.a, noDiff2 = cReaders.b.b, transform = (f: string[]) => f !== noDiff.path && f !== noDiff2.path

    expect(finiteDifference([sum(r1, noDiff, r2, 8)], transform))
      .toEqual([sum(r1, r2)])
    // Split the terms for min/max
    expect(finiteDifference([min(r1, noDiff, r2, 8)], transform))
      .toEqual([r1, r2])
    expect(finiteDifference([max(r1, noDiff, r2, 8)], transform))
      .toEqual([r1, r2])

    // **CAUTION**
    // This assumes that every term in `prod` is non-negative
    expect(finiteDifference([prod(r1, noDiff, r2, 8)], transform))
      .toEqual([r1, r2])

    // **CAUTION**
    // This assumes that `frac.x >= max(-frac.c, 0)`
    {
      expect(finiteDifference([frac(r1, noDiff)], transform))
        .toEqual([r1])
      expect(finiteDifference([frac(noDiff, r1)], transform))
        .toEqual([prod(r1, -1)])
    }

    // **CAUTION**
    // This assumes that `threshold_add.addition` is non-negative
    {
      expect(finiteDifference([threshold_add(noDiff, r2, r3)], transform))
        .toEqual([prod(r2, -1), r3])
      expect(finiteDifference([threshold_add(r1, noDiff, r3)], transform))
        .toEqual([r1, r3])
      expect(finiteDifference([threshold_add(r1, r2, noDiff)], transform))
        .toEqual([r1, prod(r2, -1)])
      expect(finiteDifference([threshold_add(noDiff, noDiff2, r3)], transform))
        .toEqual([threshold_add(noDiff, noDiff2, r3)])
      expect(finiteDifference([threshold_add(noDiff, r2, noDiff2)], transform))
        .toEqual([prod(r2, -1)])
      expect(finiteDifference([threshold_add(r1, noDiff, noDiff2)], transform))
        .toEqual([r1])
    }

    {
      expect(finiteDifference([res(noDiff)], transform))
        .toEqual([])
    }
  })
})
