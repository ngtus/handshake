// setTimeout("create('Hello world!', 'myfile.txt', 'text/plain')");

function create(text, name, type) {
  const saveBtn = document.getElementById('saveBtn');
  const file = new Blob([text], {type: type});
  saveBtn.href = URL.createObjectURL(file);
  saveBtn.download = name;
};
