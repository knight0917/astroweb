---
name: mathematical-calculation
description: >-
  Perform deterministic, arbitrary-precision mathematical calculations, symbolic algebra,
  calculus, spherical trigonometry, statistical analysis, and numerical validations without LLM approximation drift.
---

# Mathematical Calculation & Numerical Precision Skill

This skill provides rigorous, deterministic protocols for executing mathematical calculations. Large Language Models frequently make approximation errors when multiplying large numbers, evaluating trigonometric series, or computing matrix determinants. Use this skill whenever exact numerical or symbolic precision is mandatory.

---

## 1. Core Principle: Zero LLM Approximation

- **Never rely on raw LLM arithmetic** for computations requiring >4 significant digits, non-trivial algebraic factoring, transcendental functions ($\sin, \cos, \tan, \ln, \exp$), or matrix inversions.
- **Always execute deterministic code** (Python or Node.js runtime) using proven numerical packages (`math`, `decimal`, `sympy`, `scipy`, or `bignumber.js`).

---

## 2. Spherical Trigonometry Protocols

For celestial mechanics, geodesy, and astronomical coordinates:

### Great-Circle Angular Distance (Haversine Formula)
$$\text{hav}(\Delta\sigma) = \text{hav}(\Delta\phi) + \cos(\phi_1)\cos(\phi_2)\text{hav}(\Delta\lambda)$$
$$\Delta\sigma = 2 \arcsin\left(\sqrt{\sin^2\left(\frac{\phi_2 - \phi_1}{2}\right) + \cos(\phi_1)\cos(\phi_2)\sin^2\left(\frac{\lambda_2 - \lambda_1}{2}\right)}\right)$$

### Napier's Rules for Right Spherical Triangles
For a spherical triangle with right angle at $C$:
$$\sin(a) = \sin(c)\sin(A) = \tan(b)\cot(B)$$
$$\cos(c) = \cos(a)\cos(b) = \cot(A)\cot(B)$$
$$\cos(A) = \cos(a)\sin(B) = \tan(b)\cot(c)$$

### Ecliptic to Equatorial Coordinate Transformation
Given longitude $\lambda$, latitude $\beta$, and true obliquity of the ecliptic $\epsilon$:
$$\sin(\delta) = \sin(\beta)\cos(\epsilon) + \cos(\beta)\sin(\epsilon)\sin(\lambda)$$
$$\cos(\alpha)\cos(\delta) = \cos(\beta)\cos(\lambda)$$
$$\sin(\alpha)\cos(\delta) = \cos(\beta)\cos(\epsilon)\sin(\lambda) - \sin(\beta)\sin(\epsilon)$$

Where:
- $\alpha$ is Right Ascension
- $\delta$ is Declination

---

## 3. High-Precision Arithmetic Guidelines

1. **Floating-Point Guard**: IEEE-754 double precision floats experience rounding error ($0.1 + 0.2 \neq 0.3$). In financial calculations and exact degrees/minutes/seconds ($DMS$), use fixed-point or arbitrary precision (`Decimal` in Python, `BigInt` or `decimal.js` in TypeScript).
2. **Angle Normalization**: Always normalize angular calculations into $[0^\circ, 360^\circ)$ or $[-\pi, +\pi)$:
   ```python
   def normalize_degrees(deg: float) -> float:
       return (deg % 360.0 + 360.0) % 360.0
   ```
3. **Sexagesimal (DMS) Conversions**:
   - $\text{Degrees} = D + \frac{M}{60} + \frac{S}{3600}$
   - Reverse:
     $D = \lfloor\theta\rfloor$, $M = \lfloor(\theta - D) \times 60\rfloor$, $S = ((\theta - D) \times 60 - M) \times 60$

---

## 4. Execution Workflow

1. **State the mathematical formulation** clearly before computation.
2. **Execute the computation** via an automated scratch script or verified inline formula.
3. **Verify boundary limits** (e.g., $|\sin(\theta)| \le 1$, denominators $\neq 0$).
4. **Format the final output** using standard LaTeX formatting for equations and explicit precision units for scalar outputs.
