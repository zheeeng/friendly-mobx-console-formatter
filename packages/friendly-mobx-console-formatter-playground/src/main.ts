import './dx'
import { setupConsoleLog, setupDebugger } from './setup'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>Friendly Mobx Playground</h1>
    <button id="log" type="button">
      Console.log(mobxObservable)
    </button>
    <button id="debugger" type="button">
      Debugger
    </button>
  </div>
`

setupConsoleLog(document.querySelector<HTMLButtonElement>('#log')!)
setupDebugger(document.querySelector<HTMLButtonElement>('#debugger')!)
