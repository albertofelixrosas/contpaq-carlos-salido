// ========================================
// SELECCIÓN DE ELEMENTOS DEL DOM
// ========================================

const uploadForm = document.querySelector("#uploadForm")
const fileInput = document.querySelector("#fileInput")
const fileName = document.querySelector("#fileName")
const tableSection = document.querySelector("#tableSection")
const resultTable = document.querySelector("#resultTable")
const copyBtn = document.querySelector("#copyBtn")
const modal = document.querySelector("#modal")
const modalMessage = document.querySelector("#modalMessage")
const closeModalBtn = document.querySelector("#closeModal")
const toast = document.querySelector("#toast")
const segmentEditor = document.querySelector("#segmentEditor")
const noDataComponent = document.querySelector("#noData")

// ========================================
// EVENTOS
// ========================================


// =======================================
// REGEX
// =======================================

const accountNumberRegex = /^\d{3}-\d{3}-\d{3}-\d{3}-\d{2}$/
const excelCommonDateRegex =
  /^([0-2]?\d|3[01])\/(Ene|Feb|Mar|Abr|May|Jun|Jul|Ago|Sep|Oct|Nov|Dic)\/\d{4}\s?$/

// Evento: Mostrar nombre del archivo seleccionado
fileInput.addEventListener("change", (e) => {
  const file = e.target.files[0]
  if (file) {
    fileName.textContent = `Archivo seleccionado: ${file.name}`
  } else {
    fileName.textContent = ""
  }
})

// Evento: Envío del formulario
uploadForm.addEventListener("submit", (e) => {
  e.preventDefault()

  const file = fileInput.files[0]

  if (!file) {
    showModal("No fue posible procesar el archivo")
    return
  }

  // Mostrar modal de procesamiento
  showModal("Procesando archivo...")

  // Llamar directamente al método que genera la tabla
  generateResultsTable()
    .then(() => {
      // Mostrar sección de tabla
      tableSection.classList.remove("hidden")
      showModal("Procesamiento exitoso")
    })
    .catch((error) => {
      showModal("No fue posible procesar el archivo: " + error)
    })
})

// Evento: Cerrar modal
closeModalBtn.addEventListener("click", () => {
  hideModal()
})

// Evento: Cerrar modal al hacer clic en el overlay
modal.addEventListener("click", (e) => {
  if (e.target === modal || e.target.classList.contains("modal-overlay")) {
    hideModal()
  }
})

// Evento: Copiar tabla al portapapeles
copyBtn.addEventListener("click", () => {
  copyTableToClipboard()
})

// Evento mostrar el componente de edición de segmentos si hay datos en localStorage
document.addEventListener("DOMContentLoaded", () => {
  
})

// Evento para actualizar la visibilidad del componente de edición de segmentos cuando se actualice el localStorage
updateSegmentEditorVisibility()

// ========================================
// FUNCIONES DE MODAL
// ========================================

/**
 * Muestra el modal con un mensaje específico
 * @param {string} message - Mensaje a mostrar en el modal
 */
function showModal(message) {
  modalMessage.textContent = message
  modal.classList.remove("hidden")
}

/**
 * Oculta el modal
 */
function hideModal() {
  modal.classList.add("hidden")
}

// ========================================
// FUNCIONES DE TABLA
// ========================================

/**
 * Genera una tabla de ejemplo (placeholder)
 * Esta función será reemplazada con lógica real de SheetJS
 */
async function generateResultsTable() {
  // Datos de ejemplo
  const sampleData = await processExcelFile(fileInput.files[0])

  // Limpiar tabla existente
  resultTable.innerHTML = ""

  // Crear encabezados
  const thead = document.createElement("thead")
  const headerRow = document.createElement("tr")

  const headers = ["Fecha", "Egresos", "Folio", "Proveedor", "Factura", "Importe", "Concepto", "Vuelta", "Mes", "Año"]
  headers.forEach((header) => {
    const th = document.createElement("th")
    th.textContent = header
    headerRow.appendChild(th)
  })

  thead.appendChild(headerRow)
  resultTable.appendChild(thead)

  // Crear cuerpo de la tabla usando los datos procesados
  generateTableBody(sampleData)
}

/**
 * Genera el cuerpo de la tabla a partir de los datos proporcionados
 * @param {string[][]} data 
 */
function generateTableBody(data) {
  const tbody = document.createElement("tbody")

  // Aquí va la lógica para procesar los datos y llenar las filas de la tabla
  
  // Variables para mantener el estado actual de los valores del segmento y cuenta contable
  let currentAccountName = ""
  let currentSegmentName = ""
  const segmentNames = new Set()
  // Se lee las filas de principio a fin
  for (let i = 1; i < data.length; i++) {
    // Se obtiene la fila actual
    const row = data[i]
    // Se obtiene el valor de la primera columna
    const firstCell = String(row?.[0] || '').trim()

    // Se identifica el tipo de fila según el valor de la primera columna

    // 133-000-000-000-00	PRODUCCION DE CERDOS EN PROCESO
    // 1️⃣ Si la primera celda es un codigo de cuenta contable
    if (firstCell.match(accountNumberRegex)) {
      // La segunda celda es el nombre de la cuenta contable, y se guarda en la variable de estado
      currentAccountName = String(row?.[1] || '').trim()
    }
    // Segmento:  100 GG
    // 2️⃣ Si la primera celda empieza con "segmento"
    if (firstCell.toLowerCase().startsWith('segmento')) {
      // El nombre del segmento se encuentra despues de "Segmento:  " en esa misma celda
      currentSegmentName = firstCell.split(' ').filter((_, index) => index > 2).join(' ').trim()
    }
    // 3️⃣ Si la primera celda es una fecha común de Excel
    if (firstCell.match(excelCommonDateRegex)) {
      // Se crea un objeto con los datos de la fila
      const rowObject = createObjectFromRow(row)

      // Quiero convertir el objeto a un nuevo objeto que incluya los valores actuales de segmento y cuenta contable
      // FECHA	EGRESOS	FOLIO	PROVEEDOR	FACTURA	 IMPORTE 	CONCEPTO	VUELTA	MES	AÑO

      const { monthString, year } = parseDateString(rowObject.fecha)

      const newRowObject = {
        fecha: rowObject.fecha,
        egresos: rowObject.tipo,
        folio: rowObject.numero,
        proveedor: rowObject.concepto,
        factura: rowObject.ref,
        importe: rowObject.cargos,
        concepto: currentAccountName,
        vuelta: currentSegmentName,
        mes: monthString,
        año: year,
      }

      // Se crea una nueva fila en la tabla
      const tr = document.createElement("tr")
      // Se agregan las celdas a la fila
      Object.values(newRowObject).forEach((value) => {
        const td = document.createElement("td")
        td.textContent = value
        tr.appendChild(td)
        segmentNames.add(newRowObject.vuelta)
      })
      // Se agrega la fila al cuerpo de la tabla
      tbody.appendChild(tr)
    }
  }

  // Se crea el listado de segmentos encontrados al localStorage
  const segmentList = Array.from(segmentNames).map(segment => {
    return {
      segment,
      count: 0,
    }
  })

  localStorage.setItem('segmentList', JSON.stringify(segmentList))
  updateSegmentEditorVisibility()

  // Se agrega el cuerpo a la tabla
  resultTable.appendChild(tbody)
}

function showSegmentEditor() {
  segmentEditor.classList.remove("hidden")
}

function hideSegmentEditor() {
  segmentEditor.classList.add("hidden")
}

function showNoDataComponent() {
  noDataComponent.classList.remove("hidden")
}

function hideNoDataComponent() {
  noDataComponent.classList.add("hidden")
}

/**
 * Crea un objeto a partir de una fila de datos
 * @param {string[]} row - Fila de datos
 * @returns {{ fecha: string, tipo: string, numero: string, concepto: string, ref: string, cargos: string }} - Objeto con los datos de la fila
 */
function createObjectFromRow(row) {
  return {
    fecha: row[0],
    tipo: row[1],
    numero: row[2],
    concepto: row[3],
    ref: row[4],
    cargos: row[5]
  }
}

/**
 * Copia el contenido de la tabla al portapapeles
 * Formato: filas separadas por \n, columnas separadas por \t
 */
function copyTableToClipboard() {
  const rows = resultTable.querySelectorAll("tr")
  let tableText = ""

  rows.forEach((row, index) => {
    const cells = row.querySelectorAll("th, td")
    const rowData = Array.from(cells)
      .map((cell) => cell.textContent)
      .join("\t")
    tableText += rowData

    // Agregar salto de línea excepto en la última fila
    if (index < rows.length - 1) {
      tableText += "\n"
    }
  })

  // Usar la API moderna de Clipboard
  navigator.clipboard
    .writeText(tableText)
    .then(() => {
      showToast()
    })
    .catch((err) => {
      console.error("Error al copiar al portapapeles:", err)
    })
}

// ========================================
// FUNCIONES DE TOAST
// ========================================

/**
 * Muestra la notificación toast
 */
function showToast() {
  toast.classList.remove("hidden")

  // Ocultar automáticamente después de 3 segundos
  setTimeout(() => {
    hideToast()
  }, 3000)
}

/**
 * Oculta la notificación toast
 */
function hideToast() {
  toast.classList.add("hidden")
}

/*
========================================
PROCESAR ARCHIVO EXCEL
========================================

*/

/**
 * Procesa un archivo Excel y devuelve un array de arrays con los datos
 * @param {File} file - Archivo Excel a procesar
 * @returns {Promise<Array<Array<string>>>} - Promesa que resuelve con los datos del archivo
 */
async function processExcelFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    // Leer el archivo como ArrayBuffer
    reader.readAsArrayBuffer(file)

    reader.onload = (e) => {
      try {
        const arrayBuffer = e.target.result
        // Leer el archivo Excel usando SheetJS
        const workbook = XLSX.read(arrayBuffer, { type: "array" })

        // Obtener la primera hoja del archivo
        const sheetName = workbook.SheetNames[0]
        const sheet = workbook.Sheets[sheetName]

        // Convertir los datos de la hoja a un array de arrays
        const data = XLSX.utils.sheet_to_json(sheet, { header: 1 })

        resolve(data)
      } catch (error) {
        reject("Error al procesar el archivo Excel: " + error.message)
      }
    }

    reader.onerror = (error) => {
      reject("Error al leer el archivo: " + error.message)
    }
  })
}

/**
 * Convierte una fecha en formato "DD/Mmm/YYYY" a un objeto con el mes y el año
 * @param {string} dateString - Fecha en formato "DD/Mmm/YYYY"
 * @returns {{ monthString: string, year: number }} - Objeto con el mes y el año
 */
function parseDateString(dateString) {
  const months = [
    'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
  ]

  const [_, month, year] = dateString.split('/')

  if (!months.includes(month)) {
    throw new Error(`Mes inválido: ${month}`)
  }

  return {
    monthString: month,
    year: parseInt(year, 10)
  }
}

// ========================================
// ACTUALIZAR VISIBILIDAD DEL COMPONENTE DE SEGMENTOS
// ========================================

/**
 * Actualiza la visibilidad del componente de edición de segmentos
 */
function updateSegmentEditorVisibility() {
  const segmentEditor = document.querySelector(".segment-editor")
  const noDataComponent = document.querySelector(".no-data")

  const segmentList = JSON.parse(localStorage.getItem("segmentList")) || []

  if (segmentList.length > 0) {
    segmentEditor.classList.remove("hidden")
    noDataComponent.classList.add("hidden")
    populateSegmentForm()
  } else {
    segmentEditor.classList.add("hidden")
    noDataComponent.classList.remove("hidden")
  }
}

// ========================================
// ACTUALIZAR FORMULARIO DE SEGMENTOS
// ========================================

/**
 * Llena el formulario de segmentos con los datos del localStorage
 */
function populateSegmentForm() {
  const segmentGrid = document.querySelector("#segmentGrid")
  const segmentList = JSON.parse(localStorage.getItem("segmentList")) || []

  // Limpiar contenido existente
  segmentGrid.innerHTML = ""

  // Crear elementos dinámicamente
  segmentList.forEach(({ segment, count }) => {
    const segmentItem = document.createElement("div")
    segmentItem.classList.add("segment-item")

    const segmentName = document.createElement("span")
    segmentName.classList.add("segment-name")
    segmentName.textContent = segment

    const segmentInput = document.createElement("input")
    segmentInput.type = "number"
    segmentInput.classList.add("segment-input")
    segmentInput.value = count
    segmentInput.min = 0

    segmentItem.appendChild(segmentName)
    segmentItem.appendChild(segmentInput)
    segmentGrid.appendChild(segmentItem)
  })
}

/**
 * Actualiza los datos del localStorage con los valores del formulario
 */
function updateSegmentData() {
  const segmentGrid = document.querySelector("#segmentGrid")
  const segmentItems = segmentGrid.querySelectorAll(".segment-item")

  const updatedSegmentList = Array.from(segmentItems).map((item) => {
    const segment = item.querySelector(".segment-name").textContent
    const count = parseInt(item.querySelector(".segment-input").value, 10) || 0

    return { segment, count }
  })

  localStorage.setItem("segmentList", JSON.stringify(updatedSegmentList))
  showToast("Segmentos actualizados correctamente")
  populateSegmentForm()
}

// Evento: Envío del formulario de segmentos
const segmentForm = document.querySelector("#segmentForm")
segmentForm.addEventListener("submit", (e) => {
  e.preventDefault()
  updateSegmentData()
})

// Llenar el formulario al cargar la página
populateSegmentForm()