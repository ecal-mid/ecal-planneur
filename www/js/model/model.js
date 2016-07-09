import Section from 'js/model/section.js';
import Prof from 'js/model/prof.js';
import Lecturer from 'js/model/lecturer.js';
import Assistant from 'js/model/assistant.js';

class Model {
  constructor() {
    this.sections = [];
    this.profs = [];
    this.lecturer = [];
    this.assistant = [];
  }
  setup() {
    for (let i of [1, 2, 3]) {
      this.sections.push(new Section(i+'cvmid'));
    }
    for (let i of
      ['Patrick Keller',
      'Christophe Guignard',
      'Alain Bellet',
      'Angelo Benedetto',
      'Gael Hugo',
      'Cyril Diagne']) {
        var pid = (i.split(' ')[0][0] + i.split(' ')[1]).toLowerCase();
        this.profs.push(new Prof(pid, i));
    }
    for (let i of
      ['Mario Rickenbach',
      'Andreas Gysin',
      'Jussi Angesleva']) {
        var pid = (i.split(' ')[0][0] + i.split(' ')[1]).toLowerCase();
        this.lecturer.push(new Prof(pid, i));
    }
    for (let i of
      ['Tibor Udvari',
      'Romain Cazier',
      'Laura Perrenoud',
      'Marc Dubois']) {
        var pid = (i.split(' ')[0][0] + i.split(' ')[1]).toLowerCase();
        this.assistant.push(new Prof(pid, i));
    }
  }
}

export default Model;
