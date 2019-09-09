const Quill = require('quill')
var toolbarOptions = [
  [{ 'font': [] }],
  [{ 'size': ['small', false, 'large', 'huge'] }],

  ['bold', 'italic', 'underline', 'strike'],        

  [{ 'color': [] }, { 'background': [] }],  

  [{ 'script': 'sub'}, { 'script': 'super' }],      

  [{ 'header': 1 }, { 'header': 2 }],              
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  ['blockquote', 'code-block'],

  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
  [{ 'indent': '-1'}, { 'indent': '+1' }],        

  [{ 'direction': 'rtl' }],                      
  [{ 'align': [] }],
    
  ['link', 'image', 'video', 'formula'],       

  ['clean']  
]

/*var toolbarOptions = [*/
  //['bold', 'italic', 'underline', 'strike'],        // toggled buttons
  //['blockquote', 'code-block'],

  //[{ 'header': 1 }, { 'header': 2 }],               // custom button values
  //[{ 'list': 'ordered'}, { 'list': 'bullet' }],
  //[{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
  //[{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
  //[{ 'direction': 'rtl' }],                         // text direction
    
  //// custom dropdown
  //[{ 'size': ['small', false, 'large', 'huge'] }],
  //[{ 'header': [1, 2, 3, 4, 5, 6, false] }],

  //// dropdown with defaults from theme
  //[{ 'color': [] }, { 'background': [] }],  
  //[{ 'font': [] }],
  //[{ 'align': [] }],

  //// remove formatting button
  //['clean']  
/*]*/

var quill = new Quill('#editor', {
  modules: {
    toolbar: toolbarOptions
  },
  theme: 'snow'
})
