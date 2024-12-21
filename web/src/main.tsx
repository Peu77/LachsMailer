import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.tsx'
import {BrowserRouter, Route, Routes} from "react-router";
import {Login} from "@/fishing/login.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <BrowserRouter>
          <Routes>
              <Route path="/dashboard" element={<App/>}/>
              <Route path="/login/:id" element={<Login/>}/>
          </Routes>
      </BrowserRouter>
  </StrictMode>,
)
