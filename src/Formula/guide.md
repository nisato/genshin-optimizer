# Adding new Formula Actions

To add a new formula action:

- Add its *name* to `Operation` in `type.d.ts`, and
- Add its computation to `allOperations` in `optimization.ts` with the *name* as its key.
- Add appropriate entries in exhaustive switches, including in
  - `formulaString` in `debug.ts`,
  - `finiteDifference` in `difference.ts`, and
  - `constantFold` in `optimization.ts`.

Additionally, some actions are commutative, associative, and has the identity elements. These actions can be furture optimized by the optimization routine by

- Adding its name to `CommutativeMonoidOperation` (instead of `Operation`) in `type.d.ts`, and
- Add the computation to `allCommutativeMonoidOperations` (instead of `allOperations`) in `optimization.ts`.

Care must be taken around constant folding (`constantFold` in `optimization.ts`). Correctly performing constant folding are important for correctness and proper termination of the calculation. If some values are not folded properly, the computation routine may incorrectly believe that the computation is not yet finalized. Make sure that all opportunities for folding are taken.

One may also want to add appropriate utility function for constructing new action to `utils.ts`, as well as appropriate tests to `difference.test.ts` for finitary differentiation.

# Editing Formula Actions

**DO NOT** change the formula computation. It is generally much easier to introduce a new, albeit similar, formula and phase out the old ones. Many optimization and finite difference computations are littered with assumptions which may be easily broken upon edit.
