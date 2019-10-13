const Quill = require('quill');
const toolbarOptions = [
  [{'font': []}],
  [{'size': ['small', false, 'large', 'huge']}],

  ['bold', 'italic', 'underline', 'strike'],

  [{'color': []}, {'background': []}],

  [{'script': 'sub'}, {'script': 'super'}],

  [{'header': 1}, {'header': 2}],
  [{'header': [1, 2, 3, 4, 5, 6, false]}],
  ['blockquote', 'code-block'],

  [{'list': 'ordered'}, {'list': 'bullet'}],
  [{'indent': '-1'}, {'indent': '+1'}],

  [{'direction': 'rtl'}],
  [{'align': []}],

  ['link', 'image', 'video', 'formula'],

  ['clean'],
];

const quill = new Quill('#editor', {
  modules: {
    toolbar: toolbarOptions,
  },
  theme: 'snow',
});

module.exports = quill;
