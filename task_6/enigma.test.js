const { Enigma } = require("./enigma");

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function makeEnigma(
  rotorPositions = [0, 0, 0],
  ringSettings = [0, 0, 0],
  plugboardPairs = []
) {
  return new Enigma([0, 1, 2], rotorPositions, ringSettings, plugboardPairs);
}

describe("Enigma Machine", () => {
  test("Symmetry: encrypting twice with same settings returns original", () => {
    const enigma1 = makeEnigma([0, 0, 0], [0, 0, 0], []);
    const enigma2 = makeEnigma([0, 0, 0], [0, 0, 0], []);
    const message = "HELLOWORLD";
    const encrypted = enigma1.process(message);
    // Reset rotors for decryption
    const decrypted = enigma2.process(encrypted);
    expect(decrypted).toBe(message);
  });

  test("Plugboard swaps letters", () => {
    const enigma = makeEnigma([0, 0, 0], [0, 0, 0], [["A", "B"]]);
    const encrypted = enigma.process("AB");
    expect(encrypted.length).toBe(2);
    // Should not return AB, since plugboard swaps
    expect(encrypted).not.toBe("AB");
  });

  test("Rotor stepping: right rotor always steps", () => {
    const enigma = makeEnigma([0, 0, 0], [0, 0, 0], []);
    enigma.encryptChar("A");
    expect(enigma.rotors[2].position).toBe(1);
    enigma.encryptChar("A");
    expect(enigma.rotors[2].position).toBe(2);
  });

  test("Rotor stepping: middle rotor steps at notch", () => {
    // Set right rotor to notch position
    const enigma = makeEnigma([0, 0, 21], [0, 0, 0], []); // Rotor III notch at V (21)
    // Step until right rotor at notch
    for (let i = 0; i < 5; i++) enigma.encryptChar("A");
    // After stepping, middle rotor should have stepped
    expect(enigma.rotors[1].position).toBeGreaterThan(0);
  });

  test("Handles non-alphabetic characters", () => {
    const enigma = makeEnigma();
    const input = "A B!C?";
    const result = enigma.process(input);
    // Non-alphabetic characters should be preserved at the same positions
    for (let i = 0; i < input.length; i++) {
      if (!alphabet.includes(input[i].toUpperCase())) {
        expect(result[i]).toBe(input[i]);
      }
    }
  });
});
