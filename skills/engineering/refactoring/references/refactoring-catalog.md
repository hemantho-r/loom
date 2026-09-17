# Refactoring Catalog

For recognizing which smell you're looking at before picking a technique, see [smells.md](./smells.md).

## Refactoring Techniques

### Extract Method

```typescript
// Before
function process(order) {
  // validation
  // calculation
  // save
}

// After
function process(order) {
  validate(order);
  calculate(order);
  save(order);
}
```

### Extract Class

```typescript
// Before
class Person {
  name: string;
  phone: string;
  officeAreaCode: string;
  officeNumber: string;
}

// After
class Person {
  name: string;
  phone: TelephoneNumber;
}

class TelephoneNumber {
  areaCode: string;
  number: string;
}
```

### Inline Method

```typescript
// Before
function getRating(driver) {
  return moreThanFiveLateDeliveries(driver) ? 2 : 1;
}

function moreThanFiveLateDeliveries(driver) {
  return driver.numberOfLateDeliveries > 5;
}

// After
function getRating(driver) {
  return driver.numberOfLateDeliveries > 5 ? 2 : 1;
}
```

### Move Method

```typescript
// Before
class Person {
  get officeAreaCode() {
    return this._officeAreaCode;
  }
}

// After
class Person {
  get officeAreaCode() {
    return this._officeTelephone.areaCode;
  }
}
```

## Best Practices

1. Small steps
2. Test after each step
3. Commit after each success
4. One refactoring at a time
5. No behavior change
