# Enigma Bug Fix Description

## Bug Description

The original Enigma implementation had an incorrect rotor stepping mechanism. The stepping logic did not properly implement the double-stepping anomaly, which is crucial for the historical Enigma's behavior. As a result, encryption and decryption were not symmetric, and the machine did not produce correct results.

## The Fix

The `stepRotors` method in the `Enigma` class was updated to:

- Always step the rightmost rotor.
- Step the middle rotor if it is at its notch or if the rightmost rotor is at its notch (double-stepping).
- Step the leftmost rotor if the middle rotor is at its notch.

This matches the real Enigma's stepping mechanism, including the double-stepping anomaly.

## Verification

Unit tests were added to verify:

- Encryption and decryption symmetry (same settings, double encryption returns original message).
- Plugboard swaps.
- Rotor stepping behavior.
- Handling of non-alphabetic characters.

All tests pass, confirming the fix.
