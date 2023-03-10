import { name, internet, date, random } from "faker"

const generateData = (totalRows = 5) => {
	let rows = []
	for (let i = 0; i < totalRows; i++) {
		rows.push({
			id: random.uuid(),
			"pet name": name.lastName(),
			"parent name": `${name.firstName()} ${name.lastName()}`,
			email: internet.email(),
			"last visit": date.past().toLocaleDateString("en-US"),
		})
	}

	return {
		data: rows,
		columns: Object.keys(rows[0]),
	}
}

export default generateData
