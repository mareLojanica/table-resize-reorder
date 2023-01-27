import { useState } from "react"
import reactLogo from "./assets/react.svg"
import "./App.css"
import UtilTable from "./components/Table.component"

function App() {
	const [count, setCount] = useState(0)

	return <UtilTable />
}

export default App
