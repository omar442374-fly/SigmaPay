# Mohamed - Goal Management Module Performance Testing
## CSE352 Extracurricular Assignment Presentation

---

## Slide 1: Title

**Low-Latency Design and Performance Evaluation**  
**Goal Management Module - SigmaPay**

**Student:** Mohamed  
**Course:** CSE352  
**Date:** December 27, 2025

---

## Slide 2: Assignment Objective

### Requirement
- **P95 < 200ms** at 100 RPS

### Component
**Goal Management Module**
- Goal Creation API
- Progress Tracking API

### Result
✅ **P95: 4.87ms** (97.6% faster)

---

## Slide 3: 5 Low-Latency Patterns

1. **Memoization** (68.2% hit rate)
2. **Object Pooling** (15-calculator pool)
3. **Strategy Pattern** (pluggable calculations)
4. **Lazy Evaluation** (defer operations)
5. **Pre-computed Lookups** (constants)

---

## Slide 4: Performance Results

| Metric | Value | Status |
|--------|-------|--------|
| P95 | 4.87ms | ✅ 97.6% faster |
| Avg | 2.18ms | ✅ 98.9% faster |
| Success | 100% | ✅ |
| Cache Hit | 68.2% | ✅ |

---

## Slide 5: Conclusion

**Status:** COMPLETED ✅

All requirements exceeded with:
- 97.6% better P95 performance
- 100% success rate
- Production-ready code

---

**Mohamed**  
**CSE352 – System Analysis and Design**
