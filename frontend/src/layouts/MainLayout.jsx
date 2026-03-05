import Header from "../components/Header"
import Chatbot from "../components/Chatbot"
import "../styles/Chatbot.css"
import { Outlet } from "react-router-dom"

export default function MainLayout() {
  return (
    <>
      <Header />
      <Outlet />
      <Chatbot />
    </>
  )
}