import { setupCounter } from "./counter";
import "./style.css";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div class="flex flex-col justify-center items-center">
    <h1>Hello</h1>
  </div>
`;

setupCounter(document.querySelector<HTMLButtonElement>("#counter")!);
