import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import ImageClassifier from './App'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ImageClassifier />
  </StrictMode>,
)
