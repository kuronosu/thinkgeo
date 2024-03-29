import { CommandsController } from "."
import { commandText } from "../components/command"
import { getPythonCode } from "../pyTemplate"
import { downloadData, uploadData } from "../utils/files"
import getElement from "../utils/getElement"
import { ObservableValue } from "../utils/observable"

type Selectors = {
  upload: string
  download: string
  downloadPython: string
}

export default class DownloadController {
  private readonly isRunning = new ObservableValue(false)
  private readonly _commandsController: CommandsController
  private readonly uploadButton: HTMLButtonElement
  private readonly downloadButton: HTMLButtonElement
  private readonly downloadPythonButton: HTMLButtonElement

  constructor(selectors: Selectors, commandsController: CommandsController) {
    this._commandsController = commandsController
    this.uploadButton = getElement(selectors.upload)
    this.downloadButton = getElement(selectors.download)
    this.downloadPythonButton = getElement(selectors.downloadPython)
    this.setupHandlers()
  }

  private get history() {
    return this._commandsController.history
  }

  private get registry() {
    return this._commandsController.registry
  }

  private setupHandlers() {
    this.isRunning.observe((isRunning) => {
      this.uploadButton.disabled = isRunning
      this.downloadButton.disabled = isRunning
      this.downloadPythonButton.disabled = isRunning
    })

    this.uploadButton.addEventListener("click", () => {
      if (
        this.history.past.length > 0 &&
        !confirm(
          "¿Está seguro de que desea subir un archivo?\nSe perderá el código actual"
        )
      ) {
        return
      }

      uploadData((text) => {
        const rawCommands = text
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line.length > 0)
        if (rawCommands.length < 2) {
          alert("El código no es válido")
          return
        }
        if (rawCommands[0].toLowerCase() !== "inicio") {
          alert("No se encontró la palabra clave 'Inicio'")
          return
        }
        if (rawCommands[rawCommands.length - 1].toLowerCase() !== "fin") {
          alert("No se encontró la palabra clave 'Fin'")
          return
        }
        if (rawCommands.length === 2) {
          alert("El código no contiene comandos")
          return
        }
        this.isRunning.value = true
        this._commandsController
          .runScript(rawCommands.slice(1, rawCommands.length - 1).join("\n"))
          .catch((e) => {
            alert(e.message)
          })
          .finally(() => {
            this.isRunning.value = false
          })
      })
    })

    this.downloadButton.addEventListener("click", () => {
      const code = [
        "Inicio",
        ...this.history.past.map(
          (command) => "\t" + commandText(command, this.registry)
        ),
        "Fin",
      ].join("\n")
      downloadData(code, "codigo.txt")
    })

    this.downloadPythonButton.addEventListener("click", () => {
      downloadData(
        getPythonCode(
          this.history.past.map((command) =>
            commandText(command, this.registry, ",")
          )
        ),
        "codigo.py"
      )
    })
  }
}
