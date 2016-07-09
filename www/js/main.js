import Model from 'js/model/model.js';

var model = new Model();
model.setup();

console.log(model.sections[0].id);
console.log(model.profs[4].name, ', id:', model.profs[4].id);
console.log(model.lecturer[0].name, ', id:', model.lecturer[0].id);
console.log(model.assistant[2].name, ', id:', model.assistant[2].id);
