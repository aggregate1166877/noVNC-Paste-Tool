// Using this script:
// * Right click your grey gutters in the KVM console, then click 'Inspect`.
// * Go to the 'Console' tab.
// * Paste in the below function.
// * DO NOT use the keyboard to paste - use mouse. Note that mouse only works
//   when right clicking if the text area is over the grey gutters.
// * Click paste.
//
// Note that there currently isn't a stop button once the pasting starts, you
// may abort pasting by closing the KVM tab.

(function() {
  var input = '';
  var delay = '100';
  var index = -1;

  var mainDivId = '00novnccustompastetool0947-maindiv';
  var textId = '00novnccustompastetool0947-textinput';
  var numId = '00novnccustompastetool0947-numinput';

  // var textAreaDivInstance;

  function updateUserInput(event) {
    event.preventDefault();
    // As it turns out, simulating text input is a huge amount of work.
    // Completely disabling all input for now.
    //
    // switch (event.key) {
    //   case 'Alt':
    //   case 'Backspace':
    //   case 'Control':
    //   case 'Enter':
    //   case 'Shift':
    //     return;
    // }
    //
    // if (!textAreaDivInstance) {
    //   textAreaDivInstance = document.getElementById(textId);
    // }
    // textAreaDivInstance.value += event.key;
  }

  function paste(event) {
    event.preventDefault();

    // Prep user input.
    var userInput = document.getElementById(textId);
    input = userInput.value;

    // Prep delay.
    var userNumInput = document.getElementById(numId);
    delay = Number(userNumInput.value);
    if (!delay) {
      alert('Cannot proceed: delay number is invalid.');
      return close();
    }

    // Close modal.
    close(event);

    // Wait a bit before starting, allows us to see text pasted if at top of
    // screen.
    setTimeout(tick, 500);
  }

  function close(event) {
    event.preventDefault();
    var mainDiv = document.getElementById(mainDivId);
    document.body.removeChild(mainDiv);
  }

  function showGui() {
    var div = document.createElement('div');
    div.id = mainDivId;
    div.style.position = 'fixed';
    div.style.zIndex = '9999999999';
    div.style.backgroundColor = 'rgb(221 221 221 / 90%)';
    div.style.top = '0';
    div.style.left = '0';
    div.style.right = '0';
    div.style.padding = '8px';
    div.style.height = '168px';

    div.innerHTML = '<b>Paste your text</b><br>' +
      'Note: Use your mouse for copying and pasting because the KVM console ' +
      'snatches all input and this is the only sane work-around.' +
      '<br>';

    var textInput = document.createElement('textarea');
    textInput.id = textId;
    textInput.onkeydown = updateUserInput;
    textInput.style.display = 'block';
    textInput.style.width = '100%';
    textInput.style.marginBottom = '8px';

    var inputDesc = document.createElement('label');
    inputDesc.innerHTML = 'Per-key delay in ms:&nbsp;';
    inputDesc.title = 'Sending keys too fast can cause issues (such as ' +
      'skipped keys); the delay helps alleviate this.';

    var numInput = document.createElement('input');
    numInput.title = inputDesc.title;
    numInput.setAttribute('type', 'number');
    numInput.setAttribute('min', '1');
    numInput.setAttribute('max', '100000');
    numInput.value = delay;
    numInput.id = numId;

    var ok = document.createElement('button');
    ok.innerText = 'Paste';
    ok.onclick = paste;
    ok.style.margin = '8px';

    var cancel = document.createElement('button');
    cancel.innerText = 'Cancel';
    cancel.onclick = close;

    div.append(textInput);
    div.append(inputDesc);
    div.append(numInput);
    div.append(document.createElement('br'));
    div.append(cancel);
    div.append(ok);

    document.body.append(div);
  }

  function encodeAndSendKey(character) {
    // This part taken from: https://gist.github.com/byjg/a6378edb420a1c654c5f27bb494ca1c8
    var code = character.charCodeAt();
    if (code === '\r'.charCodeAt()) {
      return;
    }
    if (code === '\n'.charCodeAt()) {
      rfb.sendKey(XK_Return, 1);
      rfb.sendKey(XK_Return, 0);
      return;
    }
    var needs_shift = character.match(/[A-Z!@#$%^&*()_+{}:\"<>?~|]/);
    if (needs_shift) {
      rfb.sendKey(XK_Shift_L, 1);
    }
    rfb.sendKey(code, 1);
    rfb.sendKey(code, 0);
    if (needs_shift) {
      rfb.sendKey(XK_Shift_L, 0);
    }
  }

  function tick() {
    if (++index >= input.length) {
      return;
    }

    encodeAndSendKey(input[index]);
    setTimeout(tick, delay);
  }

  showGui();
})();
