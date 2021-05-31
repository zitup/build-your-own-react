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

wipRoot 是根 fiber,

3. 
