## build react
尝试从 render 函数开始，搞清楚 react 发生了什么。如果能对日常写代码提供一些更佳实践的思路就更好了。

1. React 的调度函数在一直运行，如果当前有工作单元，它就开始整个流程

```jsx
function workLoop(deadline) {
  // 工作

  requestIdleCallback(workLoop)
}

requestIdleCallback(workLoop)
```

实际中使用的调度是 schedule 库，这里为了简单使用 requestIdleCallback 表示


2. 当执行 render 函数时，react 会保存当前的工作，供 `workLoop` 使用

```jsx
function render(element, container) {
  wipRoot = {
    dom: container,
    props: {
      children: [element]
    },
    alternate: currentRoot,
  }
  deletions = []
  nextUnitOfWork = wipRoot
}
```

wipRoot 是根 fiber

3. `workLoop` 会一直运行，监听是否有工作需要处理

```jsx
function workLoop(deadline) {
  let shouldYield = false
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
    shouldYield = deadline.timeRemaining() < 1
  }
  if (!nextUnitOfWork && wipRoot) {
    commitRoot()
  }
  requestIdleCallback(workLoop)
}
requestIdleCallback(workLoop)
```

这里为了简单，使用 requestIdleCallback 方法进行调度，React 实际使用的是 scheduler 包。

4. 当 render 创建了根 fiber 时，workLoop 开始运行。进入到 `performUnitOfWork` 函数

```jsx
function performUnitOfWork(fiber) {
  const isFunctionComponent = fiber.type instanceof Function
  if (isFunctionComponent) {
    updateFunctionComponent(fiber)
  } else {
    updateHostComponent(fiber)
  }

  if (fiber.child) {
    return fiber.child
  }
  let nextFiber = fiber
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling
    }
    nextFiber = nextFiber.parent
  }
}
```

首先它会区分组件类型，对函数和类组件分别执行不同的函数。
