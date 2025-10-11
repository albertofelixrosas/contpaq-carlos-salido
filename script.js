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
const radioOptions = document.querySelector("#radioOptions")

// Elementos del componente de conceptos
const conceptInput = document.querySelector("#conceptInput")
const addConceptBtn = document.querySelector("#addConceptBtn")
const clearAllConceptsBtn = document.querySelector("#clearAllConceptsBtn")
const conceptsList = document.querySelector("#conceptsList")
const conceptsCounter = document.querySelector("#conceptsCounter")

// Elementos del carrusel de verificación
const verifyBtn = document.querySelector("#verifyBtn")
const verifyCarousel = document.querySelector("#verifyCarousel")
const closeCarouselBtn = document.querySelector("#closeCarousel")
const currentIndexSpan = document.querySelector("#currentIndex")
const totalRecordsSpan = document.querySelector("#totalRecords")
const dataFecha = document.querySelector("#dataFecha")
const dataProveedor = document.querySelector("#dataProveedor")
const dataFactura = document.querySelector("#dataFactura")
const dataConcepto = document.querySelector("#dataConcepto")
const dataVuelta = document.querySelector("#dataVuelta")
const conceptSelect = document.querySelector("#conceptSelect")
const prevRecordBtn = document.querySelector("#prevRecord")
const nextRecordBtn = document.querySelector("#nextRecord")
const changeConceptBtn = document.querySelector("#changeConceptBtn")
const skipRecordBtn = document.querySelector("#skipRecord")

// Variables del carrusel
let currentRecordIndex = 0
let apkDataArray = []

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

  // Dependiendo del valor del checkbox, se puede llamar a diferentes funciones (radioOptions)
  const selectedOption = document.querySelector('input[name="step"]:checked').value
  console.log("Opción seleccionada:", selectedOption)
  if (selectedOption === "apk") {
    // Lógica para APK's (si es necesario)
    generateResultsTableForAPK()
      .then(() => {
        // Mostrar sección de tabla
        tableSection.classList.remove("hidden")
        showModal("Procesamiento exitoso")
      })
      .catch((error) => {
        showModal("No fue posible procesar el archivo: " + error)
      })
  } else if (selectedOption === "gg") {
    // Lógica para GG's (si es necesario)
    generateResultsTableForGG()
      .then(() => {
        // Mostrar sección de tabla
        tableSection.classList.remove("hidden")
        showModal("Procesamiento exitoso")
      })
      .catch((error) => {
        showModal("No fue posible procesar el archivo: " + error)
      })
  }


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
  initializeConceptsManager()
})

// Eventos del componente de conceptos
addConceptBtn.addEventListener("click", () => {
  addConcept()
})

conceptInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault()
    addConcept()
  }
})

conceptInput.addEventListener("input", () => {
  validateConceptInput()
})

clearAllConceptsBtn.addEventListener("click", () => {
  showConfirmDialog("¿Estás seguro de que quieres eliminar todos los conceptos?", () => {
    clearAllConcepts()
  })
})

// Eventos del carrusel de verificación
verifyBtn.addEventListener("click", () => {
  openVerifyCarousel()
})

closeCarouselBtn.addEventListener("click", () => {
  closeVerifyCarousel()
})

verifyCarousel.addEventListener("click", (e) => {
  if (e.target === verifyCarousel || e.target.classList.contains("carousel-overlay")) {
    closeVerifyCarousel()
  }
})

prevRecordBtn.addEventListener("click", () => {
  navigateRecord(-1)
})

nextRecordBtn.addEventListener("click", () => {
  navigateRecord(1)
})

changeConceptBtn.addEventListener("click", () => {
  changeRecordConcept()
})

skipRecordBtn.addEventListener("click", () => {
  navigateRecord(1)
})

conceptSelect.addEventListener("change", () => {
  validateChangeButton()
})

// Eventos de teclado para el carrusel
document.addEventListener("keydown", (e) => {
  if (!verifyCarousel.classList.contains("hidden")) {
    switch(e.key) {
      case "ArrowLeft":
        e.preventDefault()
        navigateRecord(-1)
        break
      case "ArrowRight":
        e.preventDefault()
        navigateRecord(1)
        break
      case "Enter":
        e.preventDefault()
        if (!changeConceptBtn.disabled) {
          changeRecordConcept()
        }
        break
      case "Escape":
        e.preventDefault()
        closeVerifyCarousel()
        break
    }
  }
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
async function generateResultsTableForAPK() {
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
  generateTableBodyForAPK(sampleData)
}

/**
 * Genera una tabla de ejemplo (placeholder)
 * Esta función será reemplazada con lógica real de SheetJS
 */
async function generateResultsTableForGG() {
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
  generateTableBodyForGG(sampleData)
}

/**
 * Genera el cuerpo de la tabla a partir de los datos proporcionados
 * @param {string[][]} data 
 */
function generateTableBodyForAPK(data) {
  const tbody = document.createElement("tbody")

  // Borrar apkData de localStorage
  localStorage.removeItem('apkData')

  // Aquí va la lógica para procesar los datos y llenar las filas de la tabla

  // Variables para mantener el estado actual de los valores del segmento y cuenta contable
  let currentAccountName = ""
  let currentSegmentName = ""
  const segmentNames = new Set()
  const apkData = []
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

      apkData.push(newRowObject)

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

  localStorage.setItem('apkData', JSON.stringify(apkData))

  // Se agrega el cuerpo a la tabla
  resultTable.appendChild(tbody)
}

/**
 * Genera el cuerpo de la tabla a partir de los datos proporcionados
 * @param {string[][]} data 
 */
function generateTableBodyForGG(data) {
  const tbody = document.createElement("tbody")

  // Variables para mantener el estado actual de los valores del segmento y cuenta contable
  let currentAccountName = ""
  const accounts = []
  // Se lee las filas de principio a fin
  for (let i = 1; i < data.length; i++) {
    // Se obtiene la fila actual
    const row = data[i]
    // Se obtiene el valor de la primera columna
    const firstCell = String(row?.[0] || '').trim()
    const fifthCell = String(row?.[4] || '').trim()
    const sixthCell = String(row?.[5] || '').trim()

    // Se identifica el tipo de fila según el valor de la primera columna

    // 133-001-000-000-00	SUELDOS Y SALARIOS
    // 1️⃣ Si la primera celda es un codigo de cuenta contable
    if (firstCell.match(accountNumberRegex)) {
      // La segunda celda es el nombre de la cuenta contable, y se guarda en la variable de estado
      currentAccountName = String(row?.[1] || '').trim()
    }
    // 2️⃣ Si la cuarta celda comienza con "Total" y la quinta celda es un número que representa el total
    if (fifthCell.endsWith(currentAccountName + ':') && !isNaN(parseFloat(sixthCell.replace(/,/g, '')))) {
      // Se guarda el nombre de la cuenta contable en el array de cuentas
      accounts.push({
        account: currentAccountName,
        total: parseFloat(sixthCell.replace(/,/g, '')),
      })
    }

  }

    /*
    EQ. TRANSPORTE
    GASOLINA
    SUELDOS GJAS
    SUELDOS ADMON
  */

  // TODO: Procesar las cuentas para obtener los totales necesarios
  // para continuar con la distribución del gasto
  // y la creación de las filas de la tabla final de GG's

  /*
  MANTO.EQUIPO TRANSPORTE
  GASOLINA o 10.GASOLINA VARIOS
  SUELDOS Y SALARIOS
  */

  let totalGjas = 0
  const finalAccounts = []
  for (const account of accounts) {
    if (account.account === 'EQ. TRANSPORTE') {

    } else if (account.account === 'GASOLINA') {

    } else if (account.account === 'SUELDOS GJAS') {

    } else if (account.account === 'SUELDOS ADMON') {

    }
  }


  console.log(accounts);

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

// ========================================
// GESTIÓN DE CONCEPTOS
// ========================================

/**
 * Inicializa el gestor de conceptos cargando los datos del localStorage
 */
function initializeConceptsManager() {
  loadConceptsFromStorage()
  updateConceptsCounter()
  validateConceptInput()
}

/**
 * Obtiene los conceptos del localStorage
 * @returns {Array<string>} Array de conceptos
 */
function getConceptsFromStorage() {
  try {
    return JSON.parse(localStorage.getItem("concepts")) || []
  } catch (error) {
    console.error("Error al leer conceptos del localStorage:", error)
    return []
  }
}

/**
 * Guarda los conceptos en el localStorage
 * @param {Array<string>} concepts Array de conceptos a guardar
 */
function saveConceptsToStorage(concepts) {
  try {
    localStorage.setItem("concepts", JSON.stringify(concepts))
  } catch (error) {
    console.error("Error al guardar conceptos en localStorage:", error)
    showModal("Error al guardar los conceptos")
  }
}

/**
 * Valida la entrada del input de concepto
 */
function validateConceptInput() {
  const value = conceptInput.value.trim()
  const isValid = value.length > 0 && value.length <= 100
  
  addConceptBtn.disabled = !isValid
  
  // Cambiar estilo del input según validación
  if (value.length > 0 && !isValid) {
    conceptInput.style.borderColor = "#dc3545"
  } else {
    conceptInput.style.borderColor = value.length > 0 ? "#28a745" : "#e5e5e5"
  }
}

/**
 * Agrega un nuevo concepto
 */
function addConcept() {
  const conceptText = conceptInput.value.trim()
  
  if (!conceptText) {
    conceptInput.focus()
    return
  }
  
  if (conceptText.length > 100) {
    showModal("El concepto no puede tener más de 100 caracteres")
    return
  }
  
  const concepts = getConceptsFromStorage()
  
  // Verificar si el concepto ya existe (sin distinguir mayúsculas/minúsculas)
  const conceptExists = concepts.some(
    concept => concept.toLowerCase() === conceptText.toLowerCase()
  )
  
  if (conceptExists) {
    showModal("Este concepto ya existe en la lista")
    conceptInput.focus()
    return
  }
  
  // Agregar el nuevo concepto
  concepts.push(conceptText)
  saveConceptsToStorage(concepts)
  
  // Actualizar la UI
  loadConceptsFromStorage()
  updateConceptsCounter()
  
  // Limpiar el input
  conceptInput.value = ""
  validateConceptInput()
  conceptInput.focus()
  
  showToast()
}

/**
 * Elimina un concepto específico
 * @param {number} index Índice del concepto a eliminar
 */
function deleteConcept(index) {
  const concepts = getConceptsFromStorage()
  
  if (index >= 0 && index < concepts.length) {
    concepts.splice(index, 1)
    saveConceptsToStorage(concepts)
    loadConceptsFromStorage()
    updateConceptsCounter()
    showToast()
  }
}

/**
 * Edita un concepto específico
 * @param {number} index Índice del concepto a editar
 * @param {string} newText Nuevo texto del concepto
 */
function editConcept(index, newText) {
  const conceptText = newText.trim()
  
  if (!conceptText) {
    showModal("El concepto no puede estar vacío")
    return false
  }
  
  if (conceptText.length > 100) {
    showModal("El concepto no puede tener más de 100 caracteres")
    return false
  }
  
  const concepts = getConceptsFromStorage()
  
  // Verificar si el concepto ya existe (excluyendo el actual)
  const conceptExists = concepts.some(
    (concept, i) => i !== index && concept.toLowerCase() === conceptText.toLowerCase()
  )
  
  if (conceptExists) {
    showModal("Este concepto ya existe en la lista")
    return false
  }
  
  if (index >= 0 && index < concepts.length) {
    concepts[index] = conceptText
    saveConceptsToStorage(concepts)
    loadConceptsFromStorage()
    showToast()
    return true
  }
  
  return false
}

/**
 * Elimina todos los conceptos
 */
function clearAllConcepts() {
  saveConceptsToStorage([])
  loadConceptsFromStorage()
  updateConceptsCounter()
  showToast()
}

/**
 * Carga y muestra los conceptos desde el localStorage
 */
function loadConceptsFromStorage() {
  const concepts = getConceptsFromStorage()
  
  if (concepts.length === 0) {
    showEmptyConceptsMessage()
  } else {
    renderConceptsList(concepts)
  }
}

/**
 * Muestra el mensaje cuando no hay conceptos
 */
function showEmptyConceptsMessage() {
  conceptsList.innerHTML = `
    <div class="empty-concepts">
      <p class="empty-message">No hay conceptos guardados</p>
      <p class="empty-hint">Agrega tu primer concepto usando el formulario de arriba</p>
    </div>
  `
}

/**
 * Renderiza la lista de conceptos
 * @param {Array<string>} concepts Array de conceptos a mostrar
 */
function renderConceptsList(concepts) {
  const conceptsHTML = concepts.map((concept, index) => `
    <div class="concept-item" data-index="${index}">
      <span class="concept-text">${escapeHtml(concept)}</span>
      <div class="concept-actions">
        <button class="btn-edit-concept" onclick="startEditConcept(${index})">
          ✏️ Editar
        </button>
        <button class="btn-delete-concept" onclick="confirmDeleteConcept(${index})">
          🗑️ Eliminar
        </button>
      </div>
    </div>
  `).join("")
  
  conceptsList.innerHTML = conceptsHTML
}

/**
 * Inicia el modo de edición para un concepto
 * @param {number} index Índice del concepto a editar
 */
function startEditConcept(index) {
  const concepts = getConceptsFromStorage()
  const conceptItem = document.querySelector(`[data-index="${index}"]`)
  
  if (!conceptItem || index >= concepts.length) return
  
  const currentText = concepts[index]
  
  conceptItem.innerHTML = `
    <input type="text" class="edit-concept-input" value="${escapeHtml(currentText)}" maxlength="100">
    <div class="concept-actions">
      <button class="btn-save-concept" onclick="saveEditConcept(${index})">
        ✓ Guardar
      </button>
      <button class="btn-cancel-concept" onclick="cancelEditConcept(${index})">
        ✕ Cancelar
      </button>
    </div>
  `
  
  const input = conceptItem.querySelector(".edit-concept-input")
  input.focus()
  input.select()
  
  // Guardar en Enter
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      saveEditConcept(index)
    } else if (e.key === "Escape") {
      cancelEditConcept(index)
    }
  })
}

/**
 * Guarda la edición de un concepto
 * @param {number} index Índice del concepto
 */
function saveEditConcept(index) {
  const conceptItem = document.querySelector(`[data-index="${index}"]`)
  const input = conceptItem.querySelector(".edit-concept-input")
  
  if (input) {
    const success = editConcept(index, input.value)
    if (!success) {
      // Si falló, mantener el modo de edición y enfocar el input
      input.focus()
      input.select()
    }
  }
}

/**
 * Cancela la edición de un concepto
 * @param {number} index Índice del concepto
 */
function cancelEditConcept(index) {
  loadConceptsFromStorage()
}

/**
 * Confirma la eliminación de un concepto
 * @param {number} index Índice del concepto a eliminar
 */
function confirmDeleteConcept(index) {
  const concepts = getConceptsFromStorage()
  if (index >= 0 && index < concepts.length) {
    const conceptText = concepts[index]
    showConfirmDialog(
      `¿Estás seguro de que quieres eliminar el concepto "${conceptText}"?`,
      () => deleteConcept(index)
    )
  }
}

/**
 * Actualiza el contador de conceptos
 */
function updateConceptsCounter() {
  const concepts = getConceptsFromStorage()
  conceptsCounter.textContent = concepts.length
}

/**
 * Escapa caracteres HTML para prevenir XSS
 * @param {string} text Texto a escapar
 * @returns {string} Texto escapado
 */
function escapeHtml(text) {
  const div = document.createElement("div")
  div.textContent = text
  return div.innerHTML
}

/**
 * Muestra un diálogo de confirmación
 * @param {string} message Mensaje a mostrar
 * @param {Function} onConfirm Función a ejecutar si se confirma
 */
function showConfirmDialog(message, onConfirm) {
  const confirmed = window.confirm(message)
  if (confirmed && typeof onConfirm === "function") {
    onConfirm()
  }
}

/**
 * Obtiene todos los conceptos como array
 * @returns {Array<string>} Array de conceptos
 */
function getAllConcepts() {
  return getConceptsFromStorage()
}

/**
 * Verifica si existe un concepto específico
 * @param {string} conceptText Texto del concepto a buscar
 * @returns {boolean} true si existe, false si no
 */
function conceptExists(conceptText) {
  const concepts = getConceptsFromStorage()
  return concepts.some(
    concept => concept.toLowerCase() === conceptText.toLowerCase()
  )
}

// ========================================
// CARRUSEL DE VERIFICACIÓN APK
// ========================================

/**
 * Abre el carrusel de verificación de datos APK
 */
function openVerifyCarousel() {
  // Obtener datos de APK del localStorage
  apkDataArray = getApkDataFromStorage()
  
  if (apkDataArray.length === 0) {
    showModal("No hay datos APK para verificar. Procesa primero un archivo.")
    return
  }
  
  // Inicializar el carrusel
  currentRecordIndex = 0
  populateConceptSelector()
  displayCurrentRecord()
  updateNavigationButtons()
  
  // Mostrar el carrusel
  verifyCarousel.classList.remove("hidden")
}

/**
 * Cierra el carrusel de verificación
 */
function closeVerifyCarousel() {
  verifyCarousel.classList.add("hidden")
  currentRecordIndex = 0
  conceptSelect.value = ""
}

/**
 * Obtiene los datos APK del localStorage
 * @returns {Array<Object>} Array de objetos APK
 */
function getApkDataFromStorage() {
  try {
    return JSON.parse(localStorage.getItem("apkData")) || []
  } catch (error) {
    console.error("Error al leer datos APK del localStorage:", error)
    return []
  }
}

/**
 * Guarda los datos APK en el localStorage
 * @param {Array<Object>} data Array de objetos APK a guardar
 */
function saveApkDataToStorage(data) {
  try {
    localStorage.setItem("apkData", JSON.stringify(data))
  } catch (error) {
    console.error("Error al guardar datos APK en localStorage:", error)
    showModal("Error al guardar los datos")
  }
}

/**
 * Popula el selector de conceptos con los conceptos disponibles
 */
function populateConceptSelector() {
  const concepts = getConceptsFromStorage()
  
  // Limpiar opciones existentes excepto la primera
  conceptSelect.innerHTML = '<option value="">Seleccionar concepto...</option>'
  
  // Ordenar conceptos alfabéticamente (insensible a mayúsculas/minúsculas)
  const sortedConcepts = concepts.sort((a, b) => {
    return a.toLowerCase().localeCompare(b.toLowerCase())
  })
  
  // Agregar conceptos ordenados como opciones
  sortedConcepts.forEach(concept => {
    const option = document.createElement("option")
    option.value = concept
    option.textContent = concept
    conceptSelect.appendChild(option)
  })
  
  // Actualizar totales
  totalRecordsSpan.textContent = apkDataArray.length
}

/**
 * Muestra el registro actual en el carrusel
 */
function displayCurrentRecord() {
  if (currentRecordIndex < 0 || currentRecordIndex >= apkDataArray.length) {
    return
  }
  
  const record = apkDataArray[currentRecordIndex]
  
  // Actualizar información del registro
  currentIndexSpan.textContent = currentRecordIndex + 1
  dataFecha.textContent = record.fecha || ""
  dataProveedor.textContent = record.proveedor || ""
  dataFactura.textContent = record.factura || ""
  dataConcepto.textContent = record.concepto || ""
  dataVuelta.textContent = record.vuelta || ""
  
  // Resetear selector de conceptos
  conceptSelect.value = ""
  validateChangeButton()
}

/**
 * Navega entre registros
 * @param {number} direction Dirección de navegación (-1 para anterior, 1 para siguiente)
 */
function navigateRecord(direction) {
  const newIndex = currentRecordIndex + direction
  
  if (newIndex >= 0 && newIndex < apkDataArray.length) {
    currentRecordIndex = newIndex
    displayCurrentRecord()
    updateNavigationButtons()
  }
}

/**
 * Actualiza el estado de los botones de navegación
 */
function updateNavigationButtons() {
  prevRecordBtn.disabled = currentRecordIndex <= 0
  nextRecordBtn.disabled = currentRecordIndex >= apkDataArray.length - 1
}

/**
 * Valida si se puede habilitar el botón de cambiar
 */
function validateChangeButton() {
  const selectedConcept = conceptSelect.value.trim()
  const currentConcept = apkDataArray[currentRecordIndex]?.concepto || ""
  
  // Habilitar solo si se seleccionó un concepto diferente al actual
  changeConceptBtn.disabled = !selectedConcept || selectedConcept === currentConcept
}

/**
 * Cambia el concepto del registro actual
 */
function changeRecordConcept() {
  const selectedConcept = conceptSelect.value.trim()
  
  if (!selectedConcept) {
    showModal("Selecciona un concepto para continuar")
    return
  }
  
  const currentConcept = apkDataArray[currentRecordIndex].concepto
  
  if (selectedConcept === currentConcept) {
    showModal("El concepto seleccionado es el mismo que el actual")
    return
  }
  
  // Actualizar el concepto en el array directamente
  apkDataArray[currentRecordIndex].concepto = selectedConcept
  
  // Guardar en localStorage
  saveApkDataToStorage(apkDataArray)
  
  // Actualizar la tabla si está visible
  updateTableAfterConceptChange()
  
  // Mostrar confirmación
  showToast()
  
  // Avanzar al siguiente registro o cerrar si es el último
  if (currentRecordIndex < apkDataArray.length - 1) {
    navigateRecord(1)
  } else {
    // Es el último registro, cerrar automáticamente
    closeVerifyCarousel()
  }
}

/**
 * Actualiza la tabla después de cambiar un concepto
 */
function updateTableAfterConceptChange() {
  // Verificar si la tabla está visible y contiene datos
  if (!tableSection.classList.contains("hidden") && resultTable.querySelector("tbody")) {
    // Regenerar el cuerpo de la tabla con los nuevos datos
    const tbody = resultTable.querySelector("tbody")
    tbody.innerHTML = ""
    
    // Recrear las filas con los datos actualizados
    apkDataArray.forEach(record => {
      const tr = document.createElement("tr")
      
      // Crear celdas en el orden correcto
      const values = [
        record.fecha,
        record.egresos,
        record.folio,
        record.proveedor,
        record.factura,
        record.importe,
        record.concepto, // Este es el campo que pudo haber cambiado
        record.vuelta,
        record.mes,
        record.año
      ]
      
      values.forEach(value => {
        const td = document.createElement("td")
        td.textContent = value
        tr.appendChild(td)
      })
      
      tbody.appendChild(tr)
    })
  }
}

/**
 * Función helper para mostrar toast personalizado
 * @param {string} message Mensaje personalizado (opcional)
 */
function showToast(message = "¡Concepto actualizado correctamente!") {
  const toastMessage = document.querySelector(".toast-message")
  const originalMessage = toastMessage.textContent
  
  toastMessage.textContent = message
  toast.classList.remove("hidden")
  
  setTimeout(() => {
    hideToast()
    toastMessage.textContent = originalMessage
  }, 3000)
}