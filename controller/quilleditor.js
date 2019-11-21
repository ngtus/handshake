const Quill = require('quill');
const QuillCursors = require('quill-cursors');
Quill.register('modules/cursors', QuillCursors);


// let toolbarOptions = [
//   [{'font': []}],
//   [{'size': ['small', false, 'large', 'huge']}],

//   ['bold', 'italic', 'underline', 'strike'],

//   [{'color': []}, {'background': []}],

//   [{'script': 'sub'}, {'script': 'super'}],

//   [{'header': 1}, {'header': 2}],
//   [{'header': [1, 2, 3, 4, 5, 6, false]}],
//   ['blockquote', 'code-block'],

//   [{'list': 'ordered'}, {'list': 'bullet'}],
//   [{'indent': '-1'}, {'indent': '+1'}],

//   [{'direction': 'rtl'}],
//   [{'align': []}],

//   ['link', 'image', 'video', 'formula'],

//   ['clean'],
// ];

// const toolbar = document.getElementsByClassName('ql-toolbar');
// if (!toolbar) {
//   toolbarOptions = false;
// };

const quill = new Quill('#editor', {
  modules: {
    toolbar: '#toolbar',
    // toolbar: toolbarOptions,
    // cursors: true,
    cursors: {
      // template: '<div class="custom-cursor">...</div>',
      hideDelayMs: 8000,
      hideSpeedMs: 400,
      selectionChangeSource: null,
    },
  },
  theme: 'snow',
});

module.exports = quill;
