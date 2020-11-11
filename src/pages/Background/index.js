import '../../assets/img/icon-128.png';
import '../../assets/img/icon-34.png';
import { LOAD_MEET } from './actions';

chrome.commands.onCommand.addListener(function (command) {
  console.log('Command:', command);
  if (command === 'create-meeting')
    chrome.runtime.sendMessage({
      type: LOAD_MEET,
    });
});
