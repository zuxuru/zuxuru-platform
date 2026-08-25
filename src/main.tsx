// SPDX-License-Identifier: Apache-2.0
// Copyright (C) 2026 Shogo Technologies, Inc.
import { createRoot } from 'react-dom/client'
import App from './App'
import { ShogoErrorBoundary } from './ShogoErrorBoundary'
import './index.css'

const root = document.getElementById('root')
if (root) {
  createRoot(root).render(
    <ShogoErrorBoundary>
      <App />
    </ShogoErrorBoundary>,
  )
}
