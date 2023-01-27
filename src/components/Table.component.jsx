import React, { useState, useRef, useCallback, useEffect } from "react"
import ReactDOM from "react-dom"
import styled from "styled-components"
import { array } from "yup"
import generateData from "../utils/fakeData"

const createHeaders = (headers) => {
	return headers.map((item) => ({
		text: item,
		ref: useRef(),
	}))
}
const minCellWidth = 120
const { columns, data } = generateData(5)
const UtilTable = () => {
	const [cols, setCols] = useState(columns)
	const [rows, setRows] = useState(data)
	const [dragOver, setDragOver] = useState("")
	const [tableHeight, setTableHeight] = useState("auto")
	const [activeIndex, setActiveIndex] = useState(null)
	const tableElement = useRef(null)
	const [displayCols, setDisplayCols] = useState(cols)
	const [draggable, setDraggable] = useState(true)

	const handleDragStart = (e) => {
		const { id } = e.target
		const idx = cols.indexOf(id)
		e.dataTransfer.setData("colIdx", idx)
	}

	const handleDragOver = (e) => e.preventDefault()
	const handleDragEnter = (e) => {
		const { id } = e.target
		setDragOver(id)
	}

	const handleOnDrop = (e) => {
		const { id } = e.target
		const droppedColIdx = cols.indexOf(id)
		const draggedColIdx = Number(e.dataTransfer.getData("colIdx"))
		const tempCols = [...cols]
		const orderedColumns = tempCols.filter((el) => {
			return el !== cols[draggedColIdx]
		})

		orderedColumns.splice(droppedColIdx, 0, tempCols[draggedColIdx])
		tempCols[draggedColIdx] = cols[droppedColIdx]
		tempCols[droppedColIdx] = cols[draggedColIdx]
		setCols(orderedColumns)

		setDragOver("")
	}
	const resizableColumns = createHeaders(cols)
	console.log(cols)
	const mouseDown = (index) => {
		setDraggable(false)
		setActiveIndex(index)
	}
	const mouseMove = useCallback(
		(e) => {
			const gridColumns = resizableColumns.map((col, i) => {
				if (i === activeIndex) {
					const width = e.clientX - col.ref.current.offsetLeft

					if (width >= minCellWidth) {
						return `${width}px`
					}
				}
				return `${col.ref.current.offsetWidth}px`
			})

			tableElement.current.style.gridTemplateColumns = `${gridColumns.join(
				" "
			)}`
			setDraggable(true)
		},
		[activeIndex, columns, minCellWidth]
	)

	const removeListeners = useCallback(() => {
		window.removeEventListener("mousemove", mouseMove)
		window.removeEventListener("mouseup", removeListeners)
	}, [mouseMove])

	const mouseUp = useCallback(() => {
		setActiveIndex(null)
		removeListeners()
	}, [setActiveIndex, removeListeners])

	useEffect(() => {
		if (activeIndex !== null) {
			window.addEventListener("mousemove", mouseMove)
			window.addEventListener("mouseup", mouseUp)
		}

		return () => {
			removeListeners()
		}
	}, [activeIndex, mouseMove, mouseUp, removeListeners])

	return (
		<div className="App">
			<Table ref={tableElement}>
				<thead>
					<tr>
						{resizableColumns.map(({ ref, text }, index) => (
							<StyledTh
								id={text}
								ref={ref}
								key={index}
								draggable={draggable}
								onDragStart={handleDragStart}
								onDragOver={handleDragOver}
								onDrop={handleOnDrop}
								onDragEnter={handleDragEnter}
								dragOver={text === dragOver}
							>
								<span>{text}</span>
								<div
									onMouseDown={() => mouseDown(index)}
									className={`resize-handle ${
										activeIndex === index
											? "active"
											: "idle"
									}`}
								></div>
							</StyledTh>
						))}
					</tr>
				</thead>
				<tbody>
					{rows.map((row) => (
						<tr key={row.id}>
							{Object.entries(row).map(([k, v], idx) => (
								<Cell key={v} dragOver={cols[idx] === dragOver}>
									<span>{row[cols[idx]]}</span>
								</Cell>
							))}
						</tr>
					))}
				</tbody>
			</Table>
			{cols.map((col, index) => {
				return (
					<React.Fragment key={index}>
						<input
							type={"checkbox"}
							checked={displayCols.includes(col)}
							onChange={(e) => {
								// setDisplayCols(
								// 	displayCols.filter((el) => el !== col)
								// )
							}}
						/>
						{col}
					</React.Fragment>
				)
			})}
		</div>
	)
}

const Table = styled.table`
	border-collapse: collapse;
	width: 100%;
	display: grid;
	overflow: auto;
	grid-template-columns:
		minmax(150px, 3fr)
		minmax(150px, 1fr)
		minmax(150px, 1fr)
		minmax(150px, 1fr)
		minmax(150px, 1fr);
`

const Cell = styled.td`
	font-size: 14px;
	text-align: left;
	text-transform: capitalize;
	vertical-align: center;
	padding: 20px;
	border-bottom: 2px solid #eef0f5;
	text-transform: lowercase;
	border-left: ${({ dragOver }) => dragOver && "5px solid red"};
`

const StyledTh = styled.th`
	white-space: nowrap;
	color: #716f88;
	letter-spacing: 1.5px;
	font-weight: 600;
	font-size: 14px;
	text-align: left;
	text-transform: capitalize;
	vertical-align: middle;
	padding: 20px;
	cursor: grab;
	border-bottom: 2px solid #eef0f5;
	text-transform: uppercase;
	border-left: ${({ dragOver }) => dragOver && "5px solid red"};

	div {
		display: block;
		position: absolute;
		cursor: col-resize;
		width: 7px;
		right: 0;
		top: 0;
		z-index: 1;
		border-right: 2px solid transparent;
		&:hover {
			border-color: #ccc;
		}
	}
`

export default UtilTable
