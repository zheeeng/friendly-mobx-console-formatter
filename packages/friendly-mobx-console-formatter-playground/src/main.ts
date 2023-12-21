import './dx'
import { setupConsoleLog, setupDebugger } from './setup'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>Friendly Mobx Playground</h1>
    <ol>
      <li>Open DevTools by pressing F12 or Ctrl+Shift+I (Cmd+Option+I on Mac).</li>
      <li>Open 'Console' panel.</li>
      <li>Click the buttons below to see the formatted output in the console / debugger.</li>
    </ol>
    <hr />
    <div>
      <p>Console panel outputs 'myStore' and 'myStore2'.</p>
      <button id="log" type="button">Console.log</button>
    </div>
    <hr />
    <div>
      <p>In Debugger, try inspect the closure variables 'myStore' and 'myStore2' in Sources' Scope panel or Console panel.</p>
      <button id="debugger" type="button">Debugger</button>
    </div>
  </div>
`

setupConsoleLog(document.querySelector<HTMLButtonElement>('#log')!)
setupDebugger(document.querySelector<HTMLButtonElement>('#debugger')!)
