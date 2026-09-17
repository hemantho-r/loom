// Refactoring golden: extract-method (behavior identical to baseline)

function processOrder(order: Order): void {
  validateOrder(order);
  calculateTotal(order);
  saveOrder(order);
}

function validateOrder(order: Order): void {
  if (!order.items.length) throw new Error('Empty order');
}

function calculateTotal(order: Order): void {
  order.total = order.items.reduce((sum, i) => sum + i.price * i.qty, 0);
}

function saveOrder(order: Order): void {
  db.save(order);
}
// Gates demonstrated: tests-pass, small-steps, no-behavior-change.
