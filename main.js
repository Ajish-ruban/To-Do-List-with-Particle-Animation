import Alpine from "alpinejs";
import persist from "@alpinejs/persist";
import Proton from "proton-engine";

Alpine.plugin(persist);
window.Alpine = Alpine;

function toDoList() {
  return {
    newTodo: "",
    todos: Alpine.$persist([]).as("todos"),

    addToDo() {
      if (this.newTodo.trim() === "") return;
      this.todos.push({
        todo: this.newTodo,
        completed: false,
      });
      this.newTodo = "";
    },

    toggleToDoCompleted(index) {
      this.todos[index].completed = !this.todos[index].completed;
    },

    deleteToDo(index) {
      this.todos = this.todos.filter((todo, todoIndex) => index !== todoIndex);
    },

    numberOfToDosCompleted() {
      return this.todos.filter((todo) => todo.completed).length;
    },

    toDoCount() {
      return this.todos.length;
    },

    isLastToDo(index) {
      return this.todos.length - 1 === index;
    },
  };
}

window.toDoList = toDoList;

Alpine.start();

// bg
document.addEventListener("DOMContentLoaded", () => {
  // Create the canvas element
  const canvas = document.createElement("canvas");
  canvas.style.position = "fixed";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.zIndex = "-1";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  const proton = new Proton();
  const emitter = new Proton.Emitter();

  // Set emitter properties
  emitter.rate = new Proton.Rate(
    new Proton.Span(5, 8),
    new Proton.Span(0.1, 0.25)
  );
  emitter.addInitialize(new Proton.Mass(1));
  emitter.addInitialize(new Proton.Radius(3, 10));
  emitter.addInitialize(new Proton.Life(2, 4));
  emitter.addInitialize(
    new Proton.Velocity(
      new Proton.Span(0.5, 1),
      new Proton.Span(0, 360),
      "polar"
    )
  );

  emitter.addBehaviour(new Proton.Alpha(1, 0.1));
  emitter.addBehaviour(
    new Proton.Color("#00ffff", "#ff00ff", Infinity, Proton.easeOutQuart)
  );
  emitter.addBehaviour(new Proton.Scale(1, 0.5));
  emitter.addBehaviour(new Proton.RandomDrift(20, 20, 0.05));

  // Set emitter position and emit particles
  emitter.p.x = canvas.width / 2;
  emitter.p.y = canvas.height / 2;
  emitter.emit();

  proton.addEmitter(emitter);
  proton.addRenderer(new Proton.CanvasRenderer(canvas));

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);
    proton.update();
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  animate();

  // Handle canvas resizing
  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    emitter.p.x = canvas.width / 2;
    emitter.p.y = canvas.height / 2;
  });

  // Dispatch initial resize event
  window.dispatchEvent(new Event("resize"));
});
