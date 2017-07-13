import Second from "./Second.js";
import test from "./test.html";

const second = new Second();
second.printName();
console.log(second);

const root = document.createElement('div');
root.style.width = '200px';
root.style.height = '200px';
root.style.backgroundColor = 'red';

root.innerHTML = test;

document.body.appendChild(root);