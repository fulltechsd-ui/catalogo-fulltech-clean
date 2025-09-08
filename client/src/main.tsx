import React from 'react'
import { createRoot } from 'react-dom/client'

const App = () => React.createElement('div', null, 'FULLTECH App Working!')

const container = document.getElementById('root')
if (container) {
  const root = createRoot(container)
  root.render(React.createElement(App))
}