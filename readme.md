# Learn React Hooks

Hooks 是一种更好的编程范式。

## Basic hooks

useState, useEffect, useRef

### useState

### useRef

用于获取页面元素的引用，一般不需要，但是有些情况下需要。

### useEffect

如果第二个参数依赖列表为空，那么每次当组件更新时 useEffect 第一个参数（函数）都将被调用。组件更新并不是说调用了 setState，而是真正发生了状态改变，否则组件不会更新。

## Hooks 的使用条件

- 不要在条件语句里调用 Hooks (Only call hooks at the top level)

## More Hooks

### useContext

### useReducer

### useCallback

### useMemo
